// imports
import { Action } from "@/types"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"

function getFileExtension(fileName: string): string {
  const match = fileName.match(/\.([^.]+)$/)
  return match ? match[1] : "" // Return file extension or empty string
}

function removeFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".")
  return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName // Return filename without extension
}

function getFFmpegCommand(
  input: string,
  output: string,
  format: string
): string[] {
  // Define format-specific settings
  const formatSettings: { [key: string]: string[] } = {
    "3gp": [
      "-r",
      "20",
      "-s",
      "352x288",
      "-vb",
      "400k",
      "-acodec",
      "aac",
      "-strict",
      "experimental",
      "-ac",
      "1",
      "-ar",
      "8000",
      "-ab",
      "24k",
    ],
    mp4: [
      "-movflags",
      "+faststart",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
    ],
    mp3: ["-c:a", "libmp3lame", "-b:a", "192k"],
    wav: ["-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2"],
    ogg: ["-c:a", "libvorbis", "-b:a", "192k"],
    flac: ["-c:a", "flac"],
    avi: ["-c:v", "libxvid", "-b:v", "1000k", "-c:a", "mp3"],
    mov: [
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
    ],
    webm: ["-c:v", "libvpx", "-b:v", "1000k", "-c:a", "libvorbis"],
    m4a: ["-c:a", "aac", "-b:a", "192k"],
    // Image formats
    jpeg: [
      "-q:v",
      "2", // Set quality (1-31, lower is better)
    ],
    jpg: [
      "-q:v",
      "2", // Set quality
    ],
    png: [
      "-pix_fmt",
      "rgb8", // PNG pixel format
    ],
    gif: ["-f", "gif"],
    bmp: ["-f", "bmp"],
    tiff: ["-f", "tiff"],
    // Add more formats and settings as needed
  }

  // Get the specific settings for the target format
  const specificSettings = formatSettings[format] || []
  return ["-i", input, ...specificSettings, output]
}

export default async function convert(ffmpeg: FFmpeg, action: Action) {
  const { file, to, file_name, file_type } = action
  const input = getFileExtension(file_name)
  const output = `${removeFileExtension(file_name)}.${to}`

  // Write the input file to ffmpeg
  ffmpeg.writeFile(input, await fetchFile(file))

  // Prepare the FFmpeg command
  const ffmpeg_cmd = getFFmpegCommand(input, output, to as string)

  // Execute the command
  await ffmpeg.exec(ffmpeg_cmd)

  // Read the output file
  const data = (await ffmpeg.readFile(output)) as Uint8Array
  const blob = new Blob([data], { type: file_type.split("/")[0] })
  const url = URL.createObjectURL(blob)

  return { url, output }
}
