import { upscaleLocal } from '../../../hooks/localInference'

export async function runBrowserInference(imageFile, modelName, outputFormat, onProgress) {
  const start = performance.now()
  const bitmap = await createImageBitmap(imageFile)
  const dataUri = await upscaleLocal(bitmap, modelName, outputFormat, onProgress)
  bitmap.close()
  const end = performance.now()
  
  return {
    image: dataUri,
    provider: 'webgpu', // Could also be wasm, handled internally by localInference
    accelerator: 'GPU/CPU',
    model: modelName,
    latencyMs: Math.round(end - start),
    preprocessingMs: 0,
    inferenceMs: Math.round(end - start),
    postprocessingMs: 0,
    memoryMb: 0,
    inputResolution: 'unknown',
    outputResolution: 'unknown',
    local: true,
    networkUsed: false
  }
}
