import React, { useState, useCallback } from 'react'
import Uploader from './components/Uploader'
import OutputPanel from './components/OutputPanel'
import ModelSelector from './components/ModelSelector'
import FormatSelector from './components/FormatSelector'
import Button from './components/ui/Button'
import GlassPanel from './components/ui/GlassPanel'
import HardwareStatus from './components/ui/HardwareStatus'
import ModelStatus from './components/ui/ModelStatus'
import TelemetryPanel from './components/ui/TelemetryPanel'
import PrivacyCenter from './components/ui/PrivacyCenter'
import { useInferenceManager } from './services/inference/inferenceManager'
import { MODES } from './services/inference/providers/providerTypes'

function App() {
  const [inputImage, setInputImage] = useState(null)
  const [inputPreview, setInputPreview] = useState(null)
  const [model, setModel] = useState('RealESRGAN_x4plus')
  const [format, setFormat] = useState('png')
  
  const { capabilities, enhance, result, telemetry, isLoading, error, reset, mode, setMode, progress } = useInferenceManager()

  const handleImageSelect = useCallback((file) => {
    setInputImage(file)
    setInputPreview(URL.createObjectURL(file))
    reset()
  }, [reset])

  const handleEnhance = useCallback(async () => {
    if (!inputImage) return
    await enhance(inputImage, model, format)
  }, [inputImage, model, format, enhance])

  const handleClear = useCallback(() => {
    setInputImage(null)
    setInputPreview(null)
    reset()
  }, [reset])

  const toggleMode = useCallback(() => {
    const modes = Object.values(MODES)
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length
    setMode(modes[nextIndex])
  }, [mode, setMode])

  const isCloudMode = telemetry ? telemetry.networkUsed : (mode !== MODES.PRIVACY && (!capabilities || (!capabilities.webgpu.available && !capabilities.wasm.available && !capabilities.platform === 'windows')))

  return (
    <div className="app-container">
      <div className="watercolor-bg" aria-hidden="true">
        <div className="peacock-plume" />
        <div className="watercolor-layer layer-1" />
        <div className="watercolor-layer layer-2" />
        <div className="watercolor-layer layer-3" />
        <div className="glassy-sheen" />
        <div className="micro-refraction" />
      </div>

      <div className="film-grain" aria-hidden="true" />

      <main className="main-content">
        <header className="header">
          <h1 className="logo">
            <span className="logo-4">4XL</span>
            <span className="logo-xl" style={{ color: 'var(--edge-cyan)' }}> EDGE</span>
          </h1>
          <div className="tagline">Private AI image enhancement. Powered by your hardware.</div>
        </header>

        {/* Dashboard top row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
          <HardwareStatus capabilities={capabilities} activeProvider={telemetry?.provider} />
          <ModelStatus modelId={model} />
          <PrivacyCenter isCloudMode={isCloudMode} />
          <TelemetryPanel telemetry={telemetry} />
        </div>

        <div className="interface-grid">
          <GlassPanel className="panel-input">
            <h2 className="panel-title">Input</h2>
            <Uploader 
              onImageSelect={handleImageSelect}
              preview={inputPreview}
              disabled={isLoading}
            />
          </GlassPanel>

          <GlassPanel className="panel-output">
            <h2 className="panel-title">Result</h2>
            <OutputPanel 
              result={result}
              isLoading={isLoading}
              error={error}
              format={format}
              originalPreview={inputPreview}
              progress={progress}
              mode={mode}
            />
          </GlassPanel>
        </div>

        <GlassPanel className="controls-panel">
          <div className="controls-grid">
            <ModelSelector value={model} onChange={setModel} disabled={isLoading} />
            <FormatSelector value={format} onChange={setFormat} disabled={isLoading} />
            
            <div className="selector-group">
              <label className="selector-label">Edge Policy</label>
              <button
                className={`mode-toggle local`}
                onClick={toggleMode}
                disabled={isLoading}
              >
                <span className="mode-indicator" />
                <span className="mode-label" style={{ textTransform: 'capitalize' }}>
                  {mode}
                </span>
                <span className="provider-badge webgpu">
                  Policy
                </span>
              </button>
            </div>
          </div>
          
          <div className="actions">
            <Button 
              variant="secondary" 
              onClick={handleClear}
              disabled={isLoading || !inputImage}
            >
              Clear
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEnhance}
              disabled={isLoading || !inputImage}
              loading={isLoading}
            >
              {isLoading ? 'Enhancing...' : 'Enhance'}
            </Button>
          </div>
        </GlassPanel>

        <footer className="footer" style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-white-subtle)', fontSize: '0.85rem' }}>
          <p>Powered by Real-ESRGAN • Accelerated on Snapdragon PCs</p>
        </footer>
      </main>
    </div>
  )
}

export default App
