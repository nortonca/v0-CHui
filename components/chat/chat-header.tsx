"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, PenSquare, Search, Clock, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSidebarOpen])

  // Mock data for previous chats
  const previousChats = [
    { id: 1, title: "Research quantum computing...", time: "Today, 2:30 PM" },
    { id: 2, title: "Summarize the latest AI...", time: "Yesterday, 10:15 AM" },
    { id: 3, title: "Draft email to marketing team", time: "Mar 15, 4:45 PM" },
    { id: 4, title: "Create presentation on...", time: "Mar 12, 9:20 AM" },
    { id: 5, title: "Analyze Q1 sales data", time: "Mar 10, 11:30 AM" },
    { id: 6, title: "Research competitors' pricing...", time: "Mar 5, 3:15 PM" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-12 flex items-center px-4 z-20 bg-gray-50">
        <div className="w-full flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setIsSidebarOpen(true)}>
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

      {/* Sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-30 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 bg-white z-40 transform transition-transform duration-300 ease-in-out shadow-xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with close button */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* New Chat button */}
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full h-10 rounded-full border border-primary/20 bg-white hover:bg-primary/5 text-primary flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">New Chat</span>
            </Button>
          </div>

          {/* Search bar */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search previous chats"
                className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Previous chats section */}
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">Previous Chats</h3>
          </div>

          {/* Chat list with scrolling */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2">
              {previousChats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-primary/5 mb-1 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800 truncate">{chat.title}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {chat.time}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User profile section */}
          <div className="border-t border-gray-200 p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
              <img src="/mystical-forest-spirit.png" alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-800">John Appleseed</div>
              <div className="text-xs text-gray-500">john@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
