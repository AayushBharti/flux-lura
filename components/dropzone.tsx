"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import ReactDropzone from "react-dropzone"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  UploadCloud,
  FileSymlink,
  X,
  Download,
  Check,
  Loader,
} from "lucide-react"

import bytesToSize from "@/utils/bytes-to-size"
import fileToIcon from "@/utils/file-to-icon"
import compressFileName from "@/utils/compress-file-name"
import loadFfmpeg from "@/utils/load-ffmpeg"
import convertFile from "@/utils/convert"
import type { Action } from "@/types"

const extensions = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
}

const acceptedFiles = {
  "image/*": [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".ico",
    ".tif",
    ".tiff",
    ".raw",
    ".tga",
  ],
  "audio/*": [],
  "video/*": [],
}

export default function Dropzone() {
  const { toast } = useToast()
  const [isHover, setIsHover] = useState<boolean>(false)
  const [actions, setActions] = useState<Action[]>([])
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [defaultValues, setDefaultValues] = useState<string>("video")

  useEffect(() => {
    loadFfmpeg().then((ffmpeg) => {
      ffmpegRef.current = ffmpeg
    })
  }, [])

  useEffect(() => {
    setIsReady(actions.length > 0 && actions.every((action) => action.to))
    setProgress(0)
  }, [actions])

  const handleUpload = (uploadedFiles: File[]) => {
    setIsHover(false)
    const newActions: Action[] = uploadedFiles.map((file) => ({
      file_name: file.name,
      file_size: file.size,
      from: file.name.split(".").pop() || "",
      to: null,
      file_type: file.type,
      file,
      is_converted: false,
      is_converting: false,
      is_error: false,
    }))
    setActions((prevActions) => [...prevActions, ...newActions])
  }

  const updateAction = (fileName: string, to: string) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.file_name === fileName ? { ...action, to } : action
      )
    )
  }

  const deleteAction = (actionToDelete: Action) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action !== actionToDelete)
    )
  }

  const downloadAll = () => {
    actions.forEach((action) => {
      if (!action.is_error && action.url) {
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = action.url
        a.download = action.output || action.file_name
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(action.url)
        document.body.removeChild(a)
      }
    })
  }

  const convert = async () => {
    setIsConverting(true)
    setProgress(0)
    let completedActions = 0

    for (const action of actions) {
      try {
        if (ffmpegRef.current) {
          const { url, output } = await convertFile(ffmpegRef.current, action)
          setActions((prevActions) =>
            prevActions.map((a) =>
              a === action
                ? {
                    ...a,
                    is_converted: true,
                    is_converting: false,
                    url,
                    output,
                  }
                : a
            )
          )
        }
      } catch (err) {
        console.error(err)
        toast({
          variant: "destructive",
          title: "Error converting your file",
          description: err instanceof Error ? err.message : String(err),
          duration: 5000,
        })
        setActions((prevActions) =>
          prevActions.map((a) =>
            a === action
              ? {
                  ...a,
                  is_converted: false,
                  is_converting: false,
                  is_error: true,
                }
              : a
          )
        )
      }
      completedActions++
      setProgress((completedActions / actions.length) * 100)
    }

    setIsConverting(false)
  }

  const reset = () => {
    setActions([])
    setIsReady(false)
    setIsConverting(false)
    setProgress(0)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="w-full">
        <CardContent className="p-6">
          {actions.length === 0 ? (
            <ReactDropzone
              onDrop={handleUpload}
              onDragEnter={() => setIsHover(true)}
              onDragLeave={() => setIsHover(false)}
              accept={acceptedFiles}
              onDropRejected={() => {
                setIsHover(false)
                toast({
                  variant: "destructive",
                  title: "Error uploading your file(s)",
                  description: "Allowed Files: Audio, Video and Images.",
                  duration: 5000,
                })
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 h-64 transition-colors duration-200 ease-in-out ${
                    isHover ? "border-primary" : "border-muted-foreground/25"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center text-center">
                    {isHover ? (
                      <FileSymlink className="w-16 h-16 mb-4 text-primary" />
                    ) : (
                      <UploadCloud className="w-16 h-16 mb-4 text-muted-foreground" />
                    )}
                    <h3 className="text-lg font-semibold mb-1">
                      {isHover
                        ? "Drop your files here"
                        : "Drag & Drop files here"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                </div>
              )}
            </ReactDropzone>
          ) : (
            <div className="space-y-4">
              {actions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl text-primary">
                      {fileToIcon(action.file_type)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {compressFileName(action.file_name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({bytesToSize(action.file_size)})
                      </p>
                    </div>
                  </div>
                  {action.is_error ? (
                    <span className="text-xs text-destructive">Error</span>
                  ) : action.is_converted ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : action.is_converting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        if (extensions.audio.includes(value)) {
                          setDefaultValues("audio")
                        } else if (extensions.video.includes(value)) {
                          setDefaultValues("video")
                        } else if (extensions.image.includes(value)) {
                          setDefaultValues("image")
                        }
                        updateAction(action.file_name, value)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Convert to" />
                      </SelectTrigger>
                      <SelectContent>
                        <Tabs defaultValue={defaultValues}>
                          <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="image">Image</TabsTrigger>
                            <TabsTrigger value="video">Video</TabsTrigger>
                            <TabsTrigger value="audio">Audio</TabsTrigger>
                          </TabsList>
                          <TabsContent value="image">
                            <div className="grid grid-cols-3 gap-2">
                              {extensions.image.map((ext) => (
                                <SelectItem key={ext} value={ext}>
                                  {ext}
                                </SelectItem>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="video">
                            <div className="grid grid-cols-3 gap-2">
                              {extensions.video.map((ext) => (
                                <SelectItem key={ext} value={ext}>
                                  {ext}
                                </SelectItem>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="audio">
                            <div className="grid grid-cols-3 gap-2">
                              {extensions.audio.map((ext) => (
                                <SelectItem key={ext} value={ext}>
                                  {ext}
                                </SelectItem>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAction(action)}
                    disabled={isConverting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {isConverting && (
                <Progress value={progress} className="w-full h-2" />
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={reset}
                  disabled={isConverting}
                >
                  Reset
                </Button>
                {actions.every((action) => action.is_converted) ? (
                  <Button onClick={downloadAll}>
                    Download All
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={convert} disabled={!isReady || isConverting}>
                    {isConverting ? (
                      <>
                        Converting
                        <Loader className="w-4 h-4 ml-2 animate-spin" />
                      </>
                    ) : (
                      "Convert Now"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
