"use client"

import type React from "react"

import "ios-vibrator-pro-max"

import { useState, useRef, useEffect } from "react"
import type { MessageSection, StreamingWord, UploadedImage, ActiveButtonState } from "./types"
import ChatHeader from "./chat-header"
import MessageSectionComponent from "./message-section"
import InputArea from "./input-area"
import { useChat } from "ai/react"

export default function ChatInterface() {
  const [activeButtons, setActiveButtons] = useState<ActiveButtonState>({
    add: false,
    deepSearch: false,
    think: false,
    image: false,
    browser: false,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [messageSections, setMessageSections] = useState<MessageSection[]>([])
  const [streamingWords, setStreamingWords] = useState<StreamingWord[]>([])
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [thinking, setThinking] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [hasTyped, setHasTyped] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const newSectionRef = useRef<HTMLDivElement>(null)
  const shouldFocusAfterStreamingRef = useRef(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use the AI SDK's useChat hook
  const { messages, isLoading, append, setMessages } = useChat({
    api: "/api/chat",
    onFinish: () => {
      setThinking(null)
      setStreamingMessageId(null)
      setStreamingWords([])

      // Add vibration when streaming ends
      navigator.vibrate(50)

      // Add to completed messages set to prevent re-animation
      if (streamingMessageId) {
        setCompletedMessages((prev) => new Set(prev).add(streamingMessageId))
      }
    },
    body: {
      useSearch: activeButtons.deepSearch,
      useThinking: activeButtons.think,
    },
    onResponse: (response) => {
      // Add vibration when streaming begins
      navigator.vibrate(50)
    },
    onMessage: (message) => {
      // Check if this is a thinking message
      if (message.thinking) {
        setThinking(message.thinking)
        return
      }

      // Handle regular message chunks
      if (message.text) {
        // Add to streaming words for animation
        setStreamingWords((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: message.text,
          },
        ])
      }
    },
  })

  // Check if device is mobile and get viewport height
  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)

      // Capture the viewport height
      const vh = window.innerHeight
      setViewportHeight(vh)

      // Apply fixed height to main container on mobile
      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`
      }
    }

    checkMobileAndViewport()

    // Set initial height
    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile ? `${viewportHeight}px` : "100svh"
    }

    // Update on resize
    window.addEventListener("resize", checkMobileAndViewport)

    return () => {
      window.removeEventListener("resize", checkMobileAndViewport)
    }
  }, [isMobile, viewportHeight])

  // Organize messages into sections
  useEffect(() => {
    if (messages.length === 0) {
      setMessageSections([])
      setActiveSectionId(null)
      return
    }

    const sections: MessageSection[] = []
    let currentSection: MessageSection = {
      id: `section-${Date.now()}-0`,
      messages: [],
      isNewSection: false,
      sectionIndex: 0,
    }

    messages.forEach((message, index) => {
      // Convert AI SDK message to our internal message format
      const internalMessage = {
        id: `${message.role}-${index}`,
        content: message.content,
        type: message.role === "user" ? "user" : "system",
        completed: message.role === "assistant",
        newSection: index > 0 && messages[index - 1].role === "assistant" && message.role === "user",
      }

      if (internalMessage.newSection) {
        // Start a new section
        if (currentSection.messages.length > 0) {
          // Mark previous section as inactive
          sections.push({
            ...currentSection,
            isActive: false,
          })
        }

        // Create new active section
        const newSectionId = `section-${Date.now()}-${sections.length}`
        currentSection = {
          id: newSectionId,
          messages: [internalMessage],
          isNewSection: true,
          isActive: true,
          sectionIndex: sections.length,
        }

        // Update active section ID
        setActiveSectionId(newSectionId)
      } else {
        // Add to current section
        currentSection.messages.push(internalMessage)
      }
    })

    // Add the last section if it has messages
    if (currentSection.messages.length > 0) {
      sections.push(currentSection)
    }

    setMessageSections(sections)
  }, [messages])

  // Scroll to maximum position when new section is created, but only for sections after the first
  useEffect(() => {
    if (messageSections.length > 1) {
      setTimeout(() => {
        const scrollContainer = chatContainerRef.current

        if (scrollContainer) {
          // Scroll to maximum possible position
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          })
        }
      }, 100)
    }
  }, [messageSections])

  // Set focus back to textarea after streaming ends (only on desktop)
  useEffect(() => {
    if (!isLoading && shouldFocusAfterStreamingRef.current && !isMobile) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
      shouldFocusAfterStreamingRef.current = false
    }
  }, [isLoading, isMobile])

  // Reset uploaded images when active button changes
  useEffect(() => {
    if (activeButtons.image === false) {
      // Don't clear images if we're submitting the form
      if (!isLoading) {
        // setUploadedImages([])
      }
    }
  }, [activeButtons.image, isLoading])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (newValue.trim() !== "" && !hasTyped) {
      setHasTyped(true)
    } else if (newValue.trim() === "" && hasTyped) {
      setHasTyped(false)
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160))
      textarea.style.height = `${newHeight}px`
    }
  }

  // Custom submit handler that wraps the AI SDK's submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if ((inputValue.trim() || uploadedImages.length > 0) && !isLoading) {
      // Add vibration when message is submitted
      navigator.vibrate(50)

      // Set the streaming message ID for the upcoming assistant message
      setStreamingMessageId(`assistant-${messages.length + 1}`)

      // Reset streaming words
      setStreamingWords([])

      // Reset active buttons
      setActiveButtons({
        add: false,
        deepSearch: activeButtons.deepSearch, // Keep search state
        think: activeButtons.think, // Keep think state
        image: false,
        browser: false,
      })

      // Submit the message using the AI SDK
      append({
        role: "user",
        content: inputValue,
      })

      // Clear input and uploaded images
      setInputValue("")
      setHasTyped(false)
      setUploadedImages([])

      // On mobile, blur the textarea to dismiss the keyboard
      if (isMobile && textareaRef.current) {
        textareaRef.current.blur()
      }
    }
  }

  return (
    <div
      ref={mainContainerRef}
      className="bg-gray-50 flex flex-col overflow-hidden"
      style={{ height: isMobile ? `${viewportHeight}px` : "100svh" }}
    >
      <ChatHeader />

      <div ref={chatContainerRef} className="flex-grow pb-32 pt-12 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messageSections.map((section, sectionIndex) => (
            <MessageSectionComponent
              key={section.id}
              section={section}
              streamingMessageId={streamingMessageId}
              streamingWords={streamingWords}
              completedMessages={completedMessages}
              viewportHeight={viewportHeight}
              isLastSection={sectionIndex === messageSections.length - 1}
              newSectionRef={newSectionRef}
              thinking={thinking}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <InputArea
        inputValue={inputValue}
        setInputValue={handleInputChange}
        handleSubmit={handleSubmit}
        isStreaming={isLoading}
        isMobile={isMobile}
        activeButtons={activeButtons}
        setActiveButtons={setActiveButtons}
        textareaRef={textareaRef}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        hasTyped={hasTyped}
      />
    </div>
  )
}
