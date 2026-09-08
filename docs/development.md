# Development Guide

This document describes how to develop and build 4XL Edge.

## Web Development
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. The React application will launch at `http://localhost:5173`. Browser inference (WebGPU/WASM) works out of the box.

## Native Development (Windows)
To build the native WinUI 3 host that provides NPU acceleration:
1. Open `4xl-edge.sln` in Visual Studio 2022 (with "Windows App Development" workload installed).
2. Set the target architecture to `ARM64` (for Snapdragon laptops) or `x64`.
3. Build and Run. The app embeds the React frontend via WebView2 and exposes `QNNExecutionProvider` to the Inference Manager.

## Model Development & AI Hub
To re-compile the models for the NPU:
1. `pip install qai-hub`
2. Obtain a token from [app.aihub.qualcomm.com](https://app.aihub.qualcomm.com).
3. Export the model: `python scripts/export_onnx.py`
4. Compile for Snapdragon: `QAI_HUB_API_TOKEN="token" python scripts/ai/optimize_qnn.py --model models/browser/RealESRGAN_x4plus.onnx`

## Release
GitHub Actions handles all CI validation, native compilation, and web demo deployments automatically.
