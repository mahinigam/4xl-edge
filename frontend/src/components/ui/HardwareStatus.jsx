import React from 'react'

export default function HardwareStatus({ capabilities, activeProvider }) {
  if (!capabilities) return null

  const isLocal = capabilities.platform !== 'browser' || capabilities.webgpu.available || capabilities.wasm.available
  
  let label = "Browser Mode"
  let subLabel = "WASM/WebGPU"

  if (activeProvider === 'snapdragon-npu') {
    label = "Snapdragon NPU"
    subLabel = "Qualcomm Hexagon"
  } else if (activeProvider === 'directml') {
    label = "Discrete GPU"
    subLabel = "DirectML"
  } else if (activeProvider === 'cpu') {
    label = "CPU"
    subLabel = "Native"
  } else if (activeProvider === 'webgpu') {
    label = "Browser Mode"
    subLabel = "WebGPU"
  } else if (activeProvider === 'wasm') {
    label = "Browser Mode"
    subLabel = "WASM"
  } else if (activeProvider === 'server') {
    label = "Cloud Mode"
    subLabel = "Remote Server"
  }

  return (
    <div className="glass-panel" style={{ padding: '1rem', minWidth: '200px' }}>
      <h3 className="panel-title" style={{ marginBottom: '0.5rem', color: 'var(--edge-cyan)' }}>Active Hardware</h3>
      <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-white-subtle)' }}>{subLabel}</div>
    </div>
  )
}
