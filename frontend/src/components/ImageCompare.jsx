import React, { useState, useRef, useCallback, useEffect } from 'react'

function ImageCompare({ originalSrc, resultSrc }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  
  const containerRef = useRef(null)

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    if (e.button === 0) {
      setIsDragging(true)
      handleMove(e.clientX)
    } else if (e.button === 1 || e.button === 2) {
      setIsPanning(true)
    }
  }, [handleMove])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleMove(e.clientX)
    } else if (isPanning) {
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }))
    }
  }, [isDragging, isPanning, handleMove])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsPanning(false)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    setZoom(z => Math.max(1, Math.min(z - e.deltaY * 0.01, 10)))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (el) el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  useEffect(() => {
    if (isDragging || isPanning) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isPanning, handleMouseMove, handleMouseUp])

  return (
    <div 
      className="image-compare"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onContextMenu={e => e.preventDefault()}
      style={{ overflow: 'hidden', position: 'relative', cursor: isPanning ? 'grabbing' : 'default' }}
    >
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {/* Result image */}
        <div className="compare-layer compare-result" style={{ width: '100%', height: '100%' }}>
          <img src={resultSrc} alt="Upscaled result" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <span className="compare-label compare-label-right" style={{ transform: `scale(${1/zoom})` }}>After</span>
        </div>
        
        {/* Original image */}
        <div 
          className="compare-layer compare-original"
          style={{ width: '100%', height: '100%', clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={originalSrc} alt="Original image" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <span className="compare-label compare-label-left" style={{ transform: `scale(${1/zoom})` }}>Before</span>
        </div>
      </div>
      
      {/* Slider handle - kept outside zoom wrapper so it doesn't scale */}
      <div 
        className="compare-slider"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="compare-slider-line" />
        <div className="compare-slider-handle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 12H4m0 0l3-3m-3 3l3 3M16 12h4m0 0l-3-3m3 3l-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Instruction hint */}
      <div className="compare-hint">
        <span>Scroll to zoom, Middle-click to pan</span>
      </div>
    </div>
  )
}

export default ImageCompare
