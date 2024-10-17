import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

export default async function loadFfmpeg(): Promise<FFmpeg> {
  // Create a new instance of FFmpeg
  const ffmpeg = new FFmpeg()

  // Define the base URL for the FFmpeg core files
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd"

  try {
    // Load the core and WASM files using Blob URLs
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    })
  } catch (error) {
    // Handle any errors that occur during loading
    console.error("Failed to load FFmpeg:", error)
    throw new Error("FFmpeg loading failed. Please check your connection.")
  }

  // Return the initialized FFmpeg instance
  return ffmpeg
}
