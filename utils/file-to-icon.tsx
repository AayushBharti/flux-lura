// imports
import { FileText, Image, Video, Music, FileIcon } from "lucide-react"

export default function fileToIcon(fileType: string) {
  // if (fileType.includes("text")) return <FileText />
  if (fileType.includes("image"))
    return <Image className="text-blue-500" size={24} />
  if (fileType.includes("video"))
    return <Video className="text-green-500" size={24} />
  if (fileType.includes("audio"))
    return <Music className="text-yellow-500" size={24} />
  return <FileIcon className="text-gray-500" size={24} />
}
