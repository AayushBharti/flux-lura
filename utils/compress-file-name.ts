export default function compressFileName(fileName: string): string {
  // Define the maximum length for the substring
  const maxSubstrLength = 18

  // Trim the fileName to remove extra spaces
  fileName = fileName.trim()

  // Validate the input
  if (!fileName || typeof fileName !== "string") {
    throw new Error("Invalid file name")
  }

  // Split the fileName into name and extension
  const [name, extension] = fileName.split(/.(?=[^\.]+$)/) // Split on the last dot

  // If the fileName is shorter than the maximum length, return it as is
  if (fileName.length <= maxSubstrLength) {
    return fileName
  }

  // Calculate the number of characters to keep in the middle
  const charsToKeep = maxSubstrLength - (extension.length + 3)

  // Create the compressed fileName
  const compressedFileName =
    name.substring(0, maxSubstrLength - extension.length - 3) +
    "..." +
    name.slice(-charsToKeep) +
    "." +
    extension

  return compressedFileName
}
