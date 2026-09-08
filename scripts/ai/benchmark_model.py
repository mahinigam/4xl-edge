#!/usr/bin/env python3
"""
Benchmark compiled QNN models on real device cloud via Qualcomm AI Hub.
"""

import os
import sys
import argparse
try:
    import qai_hub as hub
except ImportError:
    sys.exit(1)

def profile_model(model_path, target_device="Snapdragon X Elite CRD"):
    print(f"Uploading {model_path} to AI Hub for Profiling...")
    model = hub.upload_model(model_path)
    
    profile_job = hub.submit_profile_job(
        model=model,
        device=hub.Device(target_device)
    )
    
    print(f"Job ID: {profile_job.job_id}. Waiting for completion...")
    profile_job.wait()
    
    print("Profile Results:")
    summary = profile_job.get_profile()
    print(summary)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Path to compiled model (.bin/.so)")
    args = parser.parse_args()
    profile_model(args.model)
