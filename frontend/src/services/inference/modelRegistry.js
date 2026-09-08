export const MODELS = {
  RealESRGAN_x4plus: {
    id: "RealESRGAN_x4plus",
    displayName: "General Enhance",
    category: "photo",
    scale: 4,
    inputFormats: ["rgb"],
    supportedProviders: [
      "snapdragon-npu",
      "directml",
      "cpu",
      "webgpu",
      "wasm",
      "server"
    ],
    sizeMb: 64,
    quality: "high",
    speed: "medium"
  },
  RealESRNet_x4plus: {
    id: "RealESRNet_x4plus",
    displayName: "Fast Enhance",
    category: "photo",
    scale: 4,
    inputFormats: ["rgb"],
    supportedProviders: [
      "snapdragon-npu",
      "directml",
      "cpu",
      "webgpu",
      "wasm",
      "server"
    ],
    sizeMb: 64,
    quality: "medium",
    speed: "fast"
  },
  RealESRGAN_x4plus_anime_6B: {
    id: "RealESRGAN_x4plus_anime_6B",
    displayName: "Anime Enhance",
    category: "anime",
    scale: 4,
    inputFormats: ["rgb"],
    supportedProviders: [
      "snapdragon-npu",
      "directml",
      "cpu",
      "webgpu",
      "wasm",
      "server"
    ],
    sizeMb: 17,
    quality: "high",
    speed: "medium"
  }
}

export function getModelRegistry() {
  return Object.values(MODELS)
}
