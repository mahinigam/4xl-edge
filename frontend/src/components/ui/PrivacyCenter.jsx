import React from 'react'

export default function PrivacyCenter({ isCloudMode }) {
  return (
    <div className="glass-panel" style={{ padding: '1rem', minWidth: '200px', border: isCloudMode ? '1px solid rgba(229, 57, 53, 0.4)' : '1px solid rgba(79, 166, 122, 0.4)' }}>
      <h3 className="panel-title" style={{ marginBottom: '0.5rem', color: isCloudMode ? 'var(--color-error)' : 'var(--color-success)' }}>
        {isCloudMode ? 'CLOUD MODE' : 'PRIVATE'}
      </h3>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-white-subtle)', lineHeight: 1.4 }}>
        {isCloudMode ? 
          'Image is being transmitted to a remote processor. Intermediate data is purged after processing.' : 
          'Image stays entirely on this device. Zero network usage during inference.'}
      </div>
    </div>
  )
}
