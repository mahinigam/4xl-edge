import React from 'react'

export default function TelemetryPanel({ telemetry }) {
  if (!telemetry) return null

  return (
    <div className="glass-panel" style={{ padding: '1rem', minWidth: '200px' }}>
      <h3 className="panel-title" style={{ marginBottom: '0.5rem', color: 'var(--edge-violet)' }}>Telemetry</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
        <div style={{ color: 'var(--color-white-subtle)' }}>Total Latency</div>
        <div style={{ textAlign: 'right', fontWeight: 600 }}>{telemetry.latencyMs} ms</div>

        <div style={{ color: 'var(--color-white-subtle)' }}>Inference Time</div>
        <div style={{ textAlign: 'right', fontWeight: 600 }}>{telemetry.inferenceMs} ms</div>
        
        <div style={{ color: 'var(--color-white-subtle)' }}>Memory</div>
        <div style={{ textAlign: 'right', fontWeight: 600 }}>{telemetry.memoryMb ? `${telemetry.memoryMb} MB` : 'N/A'}</div>

        <div style={{ color: 'var(--color-white-subtle)' }}>Network Used</div>
        <div style={{ textAlign: 'right', fontWeight: 600, color: telemetry.networkUsed ? 'var(--color-error)' : 'var(--color-success)' }}>
          {telemetry.networkUsed ? 'YES' : 'NO'}
        </div>
      </div>
    </div>
  )
}
