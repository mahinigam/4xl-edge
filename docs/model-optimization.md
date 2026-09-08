# Model Optimization Workflow

This document details the process for converting standard PyTorch models into QNN-optimized assets for Snapdragon NPUs using Qualcomm AI Hub.

## Pipeline
1. Export model to ONNX.
2. Validate ONNX structure.
3. Submit to Qualcomm AI Hub via the `qai-hub` python API.
4. Compile using the specific target SoC (e.g., Snapdragon X Elite).
5. Retrieve `.bin`/`.so` context binaries.

## How to use Qualcomm AI Hub
If you want to compile models for the Snapdragon NPU:
1. Sign up at [app.aihub.qualcomm.com](https://app.aihub.qualcomm.com).
2. Go to **Account** -> **API Token** and generate a new token.
3. In your terminal, install the package: `pip install qai-hub`
4. Set the token: `export QAI_HUB_API_TOKEN="your_token_here"`
5. Run the optimization script: `python scripts/ai/optimize_qnn.py --model models/browser/RealESRGAN_x4plus.onnx`
