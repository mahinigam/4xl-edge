const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function runServerInference(imageFile, modelName, outputFormat, onProgress) {
  const start = performance.now()
  
  onProgress?.({ stage: 'processing', message: 'Uploading to server...' })
  
  const formData = new FormData()
  formData.append('files', imageFile)

  const uploadResponse = await fetch(`${API_URL}/upload?upload_id=${Date.now()}`, {
    method: 'POST',
    body: formData,
  })
  if (!uploadResponse.ok) throw new Error('Failed to upload image')

  const uploadedFiles = await uploadResponse.json()
  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new Error('No file path returned from upload')
  }
  const filePath = uploadedFiles[0]

  const queueResponse = await fetch(`${API_URL}/call/upscale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        { path: filePath },
        modelName,
        outputFormat,
      ],
    }),
  })
  if (!queueResponse.ok) {
    const errText = await queueResponse.text()
    throw new Error(`API Error: ${errText}`)
  }

  const queueData = await queueResponse.json()
  const eventId = queueData.event_id
  if (!eventId) throw new Error('No event ID returned from API')

  onProgress?.({ stage: 'processing', message: 'Processing on server...' })

  const resultResponse = await fetch(`${API_URL}/call/upscale/${eventId}`)
  if (!resultResponse.ok) throw new Error('Failed to get result')

  const resultText = await resultResponse.text()
  const lines = resultText.split('\n')
  let resultData = null
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const parsed = JSON.parse(line.slice(6))
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          resultData = parsed[0]
        }
      } catch { /* not JSON */ }
    }
  }
  if (!resultData) throw new Error('No result returned from upscaler')
  
  const end = performance.now()

  return {
    image: resultData,
    provider: 'server',
    accelerator: 'Cloud',
    model: modelName,
    latencyMs: Math.round(end - start),
    preprocessingMs: 0,
    inferenceMs: 0,
    postprocessingMs: 0,
    memoryMb: 0,
    inputResolution: 'unknown',
    outputResolution: 'unknown',
    local: false,
    networkUsed: true
  }
}
