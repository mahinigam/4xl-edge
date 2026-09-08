# Model Optimization Workflow

This document details the process for converting standard PyTorch models into QNN-optimized assets for Snapdragon NPUs using Qualcomm AI Hub.

## Pipeline
1. Export model to ONNX.
2. Validate ONNX structure.
3. Submit to Qualcomm AI Hub via the `qai-hub` python API.
4. Compile using the specific target SoC (e.g., Snapdragon X Elite).
5. Retrieve `.bin`/`.so` context binaries.
