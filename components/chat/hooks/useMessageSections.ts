'use client';

import { useState, useCallback, useEffect, useRef } from "react"
import type { MessageSection, Message } from "../types"

/**
 * Hook for organizing messages into sections
 * Handles section creation, activation, and scrolling
 */
export function useMessageSections(messages: Message[]) {
  const [messageSections, setMessageSections] = useState<MessageSection[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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

    messages.forEach((message) => {
      if (message.newSection) {
        if (currentSection.messages.length > 0) {
          sections.push({
            ...currentSection,
            isActive: false,
          })
        }

        const newSectionId = `section-${Date.now()}-${sections.length}`
        currentSection = {
          id: newSectionId,
          messages: [message],
          isNewSection: true,
          isActive: true,
          sectionIndex: sections.length,
        }

        setActiveSectionId(newSectionId)
      } else {
        currentSection.messages.push(message)
      }
    })

    if (currentSection.messages.length > 0) {
      sections.push(currentSection)
    }

    setMessageSections(sections)
  }, [messages])

  // Scroll to latest section
  useEffect(() => {
    if (messageSections.length > 1) {
      setTimeout(() => {
        const scrollContainer = chatContainerRef.current

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          })
        }
      }, 100)
    }
  }, [messageSections])

  return {
    messageSections,
    activeSectionId,
    chatContainerRef,
  }
}
