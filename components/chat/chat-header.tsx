"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, PenSquare } from "lucide-react"
import MenuModal from "./menu-modal"

export default function ChatHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-12 flex items-center px-4 z-20 bg-background border-b border-border">
        <div className="w-full flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Menu</span>
          </Button>

          <h1 className="text-base font-medium text-foreground">v0 Chat</h1>

          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <PenSquare className="h-5 w-5 text-foreground" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </header>

      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
