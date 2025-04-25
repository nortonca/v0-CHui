import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UploadedImage } from "../types"

interface SendButtonProps {
  hasTyped: boolean
  inputValue: string
  isStreaming: boolean
  uploadedImages: UploadedImage[]
}

export default function SendButton({ hasTyped, inputValue, isStreaming, uploadedImages }: SendButtonProps) {
  return (
    <Button
      type="submit"
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 border-0 flex-shrink-0 transition-all duration-200",
        hasTyped || uploadedImages.length > 0 ? "bg-black scale-110" : "bg-gray-200",
      )}
      disabled={(!inputValue.trim() && uploadedImages.length === 0) || isStreaming}
    >
      <ArrowUp
        className={cn(
          "h-4 w-4 transition-colors",
          hasTyped || uploadedImages.length > 0 ? "text-white" : "text-gray-500",
        )}
      />
      <span className="sr-only">Submit</span>
    </Button>
  )
}
