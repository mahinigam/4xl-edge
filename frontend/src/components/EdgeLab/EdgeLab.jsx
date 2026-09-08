import React, { useEffect, useState } from 'react'
import { detectCapabilities } from '../../services/inference/hardwareCapabilities'
import { getModelRegistry } from '../../services/inference/modelRegistry'

export default function EdgeLab() {
  const [caps, setCaps] = useState(null)
  const models = getModelRegistry()

  useEffect(() => {
    detectCapabilities().then(setCaps)
  }, [])

  if (!caps) return <div style={{ padding: '2rem', color: 'white' }}>Loading Lab...</div>

  return (
    <div className="app-container" style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--edge-cyan)', marginBottom: '2rem' }}>4XL EDGE LAB</h1>
      
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-panel">
          <h2 style={{ color: 'var(--edge-teal)', marginBottom: '1rem' }}>Hardware Detected</h2>
          <pre style={{ color: 'var(--color-white-subtle)' }}>
            {JSON.stringify(caps, null, 2)}
          </pre>
        </div>

        <div className="glass-panel">
          <h2 style={{ color: 'var(--edge-violet)', marginBottom: '1rem' }}>Available Models</h2>
          {models.map(m => (
            <div key={m.id} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <strong>{m.displayName}</strong> ({m.id})<br />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-white-subtle)' }}>
                Size: {m.sizeMb}MB | Target: {m.supportedProviders.join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <a href="/" style={{ color: 'var(--edge-cyan)', marginTop: '2rem', display: 'inline-block' }}>&larr; Back to App</a>
    </div>
  )
}
