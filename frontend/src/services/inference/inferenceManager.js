import { useState, useCallback, useEffect } from 'react'
import { detectCapabilities } from './hardwareCapabilities'
import { runBrowserInference } from './providers/browserProvider'
import { runServerInference } from './providers/serverProvider'
import { runNativeInference } from './providers/nativeProvider'
import { MODES, PROVIDERS } from './providers/providerTypes'

export function useInferenceManager() {
  const [capabilities, setCapabilities] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState(MODES.AUTO)
  const [progress, setProgress] = useState(null)
  const [telemetry, setTelemetry] = useState(null)

  useEffect(() => {
    detectCapabilities().then(caps => setCapabilities(caps))
  }, [])

  const determineProvider = useCallback((modelName) => {
    if (!capabilities) return PROVIDERS.SERVER
    
    if (mode === MODES.PRIVACY) {
      if (capabilities.platform === 'windows' && capabilities.npu.available) return PROVIDERS.SNAPDRAGON_NPU
      if (capabilities.platform === 'windows' && capabilities.gpu.available) return PROVIDERS.DIRECTML
      if (capabilities.webgpu.available) return PROVIDERS.WEBGPU
      if (capabilities.wasm.available) return PROVIDERS.WASM
      throw new Error("No local provider available for privacy mode")
    }

    if (capabilities.platform === 'windows' && capabilities.npu.available) return PROVIDERS.SNAPDRAGON_NPU
    if (capabilities.platform === 'windows' && capabilities.gpu.available) return PROVIDERS.DIRECTML
    if (capabilities.webgpu.available) return PROVIDERS.WEBGPU
    return PROVIDERS.SERVER
  }, [capabilities, mode])

  const enhance = useCallback(async (imageFile, modelName, outputFormat) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setProgress(null)
    setTelemetry(null)

    try {
      const targetProvider = determineProvider(modelName)
      let res;
      
      setProgress({ stage: 'init', message: `Routing to ${targetProvider}...` })

      if (targetProvider === PROVIDERS.SNAPDRAGON_NPU || targetProvider === PROVIDERS.DIRECTML || targetProvider === PROVIDERS.CPU) {
        try {
          res = await runNativeInference(imageFile, modelName, outputFormat, setProgress)
        } catch (e) {
          console.warn("Native inference failed, falling back to browser", e)
          res = await runBrowserInference(imageFile, modelName, outputFormat, setProgress)
        }
      } else if (targetProvider === PROVIDERS.WEBGPU || targetProvider === PROVIDERS.WASM) {
        try {
          res = await runBrowserInference(imageFile, modelName, outputFormat, setProgress)
        } catch (e) {
          console.warn("Browser inference failed, falling back to server", e)
          if (mode === MODES.PRIVACY) throw new Error("Local inference failed. Cloud is disabled in Privacy Mode.")
          res = await runServerInference(imageFile, modelName, outputFormat, setProgress)
        }
      } else {
        res = await runServerInference(imageFile, modelName, outputFormat, setProgress)
      }

      setResult(res.image)
      setTelemetry(res)
      setProgress({ stage: 'done', message: 'Enhancement complete' })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to enhance image.')
    } finally {
      setIsLoading(false)
    }
  }, [determineProvider, mode])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setIsLoading(false)
    setProgress(null)
    setTelemetry(null)
  }, [])

  return {
    capabilities,
    enhance,
    result,
    telemetry,
    isLoading,
    error,
    reset,
    mode,
    setMode,
    progress
  }
}
