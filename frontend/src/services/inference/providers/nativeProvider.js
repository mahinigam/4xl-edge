/**
 * Communicates with the C#/WinUI 3 host app via WebView2 messaging.
 */
export async function runNativeInference(imageFile, modelName, outputFormat, onProgress) {
  if (!window.chrome || !window.chrome.webview) {
    throw new Error("Not running in a native wrapper")
  }

  // Convert File to Base64 to send across the bridge
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(imageFile)
  })

  return new Promise((resolve, reject) => {
    onProgress?.({ stage: 'processing', message: 'Sending to Native Inference Engine...' })
    
    const handler = (event) => {
      const data = event.data
      if (data && data.type === 'inferenceProgress') {
        onProgress?.(data.progress)
      } else if (data && data.type === 'inferenceResult') {
        window.chrome.webview.removeEventListener('message', handler)
        if (data.error) {
          reject(new Error(data.error))
        } else {
          resolve({
            image: data.image,
            provider: data.provider || 'snapdragon-npu',
            accelerator: data.accelerator || 'Hexagon NPU',
            model: modelName,
            latencyMs: data.latencyMs || 0,
            preprocessingMs: data.preprocessingMs || 0,
            inferenceMs: data.inferenceMs || 0,
            postprocessingMs: data.postprocessingMs || 0,
            memoryMb: data.memoryMb || 0,
            inputResolution: data.inputResolution || 'unknown',
            outputResolution: data.outputResolution || 'unknown',
            local: true,
            networkUsed: false
          })
        }
      }
    }
    window.chrome.webview.addEventListener('message', handler)
    window.chrome.webview.postMessage({
      type: 'infer',
      modelName,
      outputFormat,
      image: base64
    })
  })
}
