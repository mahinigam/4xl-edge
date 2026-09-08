# 4XL Edge Architecture

This document describes the architecture of 4XL Edge.

## Overview
4XL Edge transforms the original 4XL web-based upscaler into a privacy-first on-device AI image enhancement platform. It features intelligent routing to Snapdragon NPUs, GPUs, and CPUs.

## Edge Runtime
The application includes an Inference Manager that abstracts execution across multiple environments:
- **Native Snapdragon**: Utilizing Qualcomm Neural Network (QNN) Execution Provider via ONNX Runtime.
- **Native Windows**: DirectML (GPU) or CPU fallbacks via ONNX Runtime.
- **Browser**: WebGPU and WASM fallbacks using ONNX Runtime Web.
- **Cloud**: Remote server inference when local execution is impossible or explicitly disabled.
