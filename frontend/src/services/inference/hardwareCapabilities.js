import { hasWebGPU } from '../../hooks/localInference'

/**
 * Detects the capabilities of the hardware running the app.
 * Can use WebView2 injected objects to determine native capabilities.
 */
export async function detectCapabilities() {
  const capabilities = {
    platform: "browser",
    architecture: "unknown",
    soc: "Unknown",
    npu: { available: false, provider: null },
    gpu: { available: false, provider: null },
    cpu: { available: true },
    webgpu: { available: false },
    wasm: { available: true },
    server: { available: true }
  }

  // Check WebView2 Native Bridge
  if (window.chrome && window.chrome.webview) {
    try {
      capabilities.platform = "windows"
      
      // Async request to native host to detect hardware
      const nativeCaps = await new Promise((resolve, reject) => {
        const handler = (event) => {
          if (event.data && event.data.type === 'capabilitiesResult') {
            window.chrome.webview.removeEventListener('message', handler)
            resolve(event.data.capabilities)
          }
        }
        window.chrome.webview.addEventListener('message', handler)
        window.chrome.webview.postMessage({ type: 'getCapabilities' })
        
        // Timeout
        setTimeout(() => reject('Timeout'), 2000)
      })

      if (nativeCaps) {
        Object.assign(capabilities, nativeCaps)
      }
    } catch (e) {
      console.warn("Native bridge capability detection failed or timed out", e)
    }
  }

  // Check Browser capabilities
  capabilities.webgpu.available = await hasWebGPU()

  return capabilities
}
