export default function bytesToSize(
  bytes: number,
  decimals: number = 2
): string {
  if (bytes < 0) return "Invalid input" // Handle negative bytes
  if (bytes === 0) return "0 Bytes"

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  // Calculate size with specified precision
  const size = (bytes / Math.pow(1024, i)).toFixed(decimals)

  // Use pluralization for the unit
  return `${size} ${sizes[i]}${size !== "1" ? "s" : ""}`
}
