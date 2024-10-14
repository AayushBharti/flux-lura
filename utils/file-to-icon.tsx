// imports
import { FileAudio, FileText, Image, File, Video } from "lucide-react"



export default function fileToIcon( fileType:string ) {
  if (fileType.includes("video")) return <Video />
  if (fileType.includes("audio")) return <FileAudio />
  if (fileType.includes("text")) return <FileText />
  if (fileType.includes("image")) return <Image />
  return <File />
}
