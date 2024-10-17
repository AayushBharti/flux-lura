import Dropzone from "@/components/dropzone"

export default function Home() {
  return (
    <div className="flex justify-center flex-col text-center pb-8 space-y-16 mx-auto">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-primary md:text-6xl">
          FluxLura File Converter
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert your files instantly, for free, and without limits. Transform
          images, audio, and videos effortlessly with FluxLura!
        </p>
      </div>
      <Dropzone />
    </div>
  )
}
