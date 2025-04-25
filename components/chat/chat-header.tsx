import { Button } from "@/components/ui/button"
import { Menu, PenSquare } from "lucide-react"

export default function ChatHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-12 flex items-center px-4 z-20 bg-gray-50">
      <div className="w-full flex items-center justify-between px-2">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Menu className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Menu</span>
        </Button>

        <h1 className="text-base font-medium text-gray-800">v0 Chat</h1>

        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <PenSquare className="h-5 w-5 text-gray-700" />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>
    </header>
  )
}
