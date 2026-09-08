import React from 'react'
import { MODELS } from '../../services/inference/modelRegistry'

export default function ModelStatus({ modelId }) {
  const model = MODELS[modelId]
  if (!model) return null

  return (
    <div className="glass-panel" style={{ padding: '1rem', minWidth: '200px' }}>
      <h3 className="panel-title" style={{ marginBottom: '0.5rem', color: 'var(--edge-teal)' }}>Active Model</h3>
      <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{model.displayName}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-white-subtle)' }}>{model.id} • {model.sizeMb}MB</div>
    </div>
  )
}
