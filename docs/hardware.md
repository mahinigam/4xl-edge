# Hardware Capability Detection

4XL Edge relies on hardware detection to optimally schedule image enhancement tasks.

## Supported Providers
1. **Snapdragon NPU**: Preferred execution path for efficiency and performance.
2. **GPU (DirectML)**: Fallback for systems lacking an NPU.
3. **CPU**: Ultimate local fallback.
4. **Browser (WebGPU/WASM)**: Cross-platform web inference.
