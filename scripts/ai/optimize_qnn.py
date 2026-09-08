#!/usr/bin/env python3
"""
Submit ONNX models to Qualcomm AI Hub for compilation to QNN context binaries.

Usage:
    export QAI_HUB_API_TOKEN="<your_token>"
    python scripts/ai/optimize_qnn.py --model models/browser/RealESRGAN_x4plus.onnx
"""

import os
import sys
import argparse
try:
    import qai_hub as hub
except ImportError:
    print("qai_hub not installed. Please run `pip install qai-hub`")
    sys.exit(1)

def compile_model(model_path, target_device="Snapdragon X Elite CRD"):
    if not os.path.exists(model_path):
        print(f"Model file {model_path} not found.")
        sys.exit(1)
        
    print(f"Uploading {model_path} to Qualcomm AI Hub...")
    model = hub.upload_model(model_path)
    print(f"Model uploaded successfully. ID: {model.model_id}")

    print(f"Submitting compile job for {target_device}...")
    # Note: RealESRGAN input is dynamic, but AI Hub requires static shapes for compilation.
    # We define a standard patch size for compilation.
    compile_job = hub.submit_compile_job(
        model=model,
        device=hub.Device(target_device),
        input_specs={"input": ((1, 3, 256, 256), "float32")},
        options="--target_runtime qnn_lib_aarch64_windows"
    )

    print(f"Job ID: {compile_job.job_id}. Waiting for completion...")
    compile_job.wait()

    if compile_job.get_status().code != 0:
        print("Compile job failed or timed out.")
        sys.exit(1)

    target_model = compile_job.get_target_model()
    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "models", "native")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Downloading compiled QNN artifact to {out_dir}...")
    compile_job.download_profile(out_dir)
    compile_job.download_target_model(out_dir)
    print("Compilation and download complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimize model for Snapdragon NPU via QAI Hub")
    parser.add_argument("--model", required=True, help="Path to input ONNX model")
    parser.add_argument("--device", default="Snapdragon X Elite CRD", help="Target device name")
    args = parser.parse_args()
    
    # Ensure token is set
    if "QAI_HUB_API_TOKEN" not in os.environ:
        print("ERROR: QAI_HUB_API_TOKEN environment variable is not set.")
        print("Please sign up at app.aihub.qualcomm.com, navigate to Account -> API Token.")
        sys.exit(1)
        
    compile_model(args.model, args.device)
