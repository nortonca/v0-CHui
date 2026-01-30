"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Message, MessageSection, StreamingWord, UploadedImage, ActiveButtonState, ToolCall } from "./types"
import { getAIResponse } from "./utils"
import ChatHeader from "./chat-header"
import MessageSectionComponent from "./message-section"
import OnboardingModal, { type OnboardingData } from "@/components/onboarding/onboarding-modal"
import ActivityModalContent, { type ActivityItem, type ScheduledTask } from "./activity-modal-content"
import type { Memory } from "./memory-panel"
import type { Checkpoint } from "./checkpoints-panel"
import type { Playbook } from "./playbooks-panel"
import type { CollaborationMode } from "./collaboration-mode"
import { useModal } from "@/components/providers/modal-provider"
import InputAreaSimplified from "./input/input-area-simplified"

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const newSectionRef = useRef<HTMLDivElement>(null)
  const [activeButtons, setActiveButtons] = useState<ActiveButtonState>({
    add: false,
    tools: false,
    thinkLevel: "off",
    image: false,
    browser: false,
    selectedTools: [],
  })
  const [isMobile, setIsMobile] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageSections, setMessageSections] = useState<MessageSection[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingWords, setStreamingWords] = useState<StreamingWord[]>([])
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [viewportHeight, setViewportHeight] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const shouldFocusAfterStreamingRef = useRef(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false) // Declared the variable here

  // New feature states
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>("collaborate")
  const { openModal, closeModal } = useModal()
  
  // Activity feed state
  const [activities, setActivities] = useState<ActivityItem[]>([])
  
  // Memory state (lifted up from InputArea for persistence)
  const [memories, setMemories] = useState<Memory[]>([])
  
  // Checkpoints state
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [currentCheckpointId, setCurrentCheckpointId] = useState<string | undefined>()
  
  // Playbooks state
  const [playbooks, setPlaybooks] = useState<Playbook[]>([])
  
  // Scheduled tasks state
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])

  // Handle activity modal
  const handleOpenActivity = () => {
    openModal(
      "activity",
      <ActivityModalContent
        onClose={() => closeModal("activity")}
        activities={activities}
        scheduledTasks={scheduledTasks}
      />,
      () => {}
    )
  }

  // Handle onboarding completion
  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data)
    setShowOnboarding(false)
    setCollaborationMode(data.collaborationMode)
    
    // Add initial memories from onboarding
    const newMemories: Memory[] = []
    
    if (data.userRole) {
      newMemories.push({
        id: `memory-${Date.now()}-1`,
        category: "fact",
        text: `Works as: ${data.userRole}`,
        createdAt: new Date(),
        source: "user",
      })
    }
    
    if (data.primaryUse) {
      newMemories.push({
        id: `memory-${Date.now()}-2`,
        category: "workflow",
        text: `Primary use: ${data.primaryUse}`,
        createdAt: new Date(),
        source: "user",
      })
    }
    
    newMemories.push({
      id: `memory-${Date.now()}-3`,
      category: "preference",
      text: `Collaboration mode: ${data.collaborationMode}`,
      createdAt: new Date(),
      source: "user",
    })
    
    setMemories(newMemories)
    
    // Add welcome activity
    setActivities([{
      id: `activity-${Date.now()}`,
      type: "completed",
      title: "Onboarding completed",
      description: `Welcome! I'm ${data.assistantName}, ready to help.`,
      timestamp: new Date(),
      status: "completed",
    }])
    
    // Create initial checkpoint
    const initialCheckpoint: Checkpoint = {
      id: `checkpoint-${Date.now()}`,
      title: "Session Started",
      description: "Fresh conversation began",
      timestamp: new Date(),
      messageCount: 0,
      type: "auto",
    }
    setCheckpoints([initialCheckpoint])
    setCurrentCheckpointId(initialCheckpoint.id)
  }

  // Add activity helper
  const addActivity = (activity: Omit<ActivityItem, "id" | "timestamp">) => {
    setActivities(prev => [{
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    }, ...prev].slice(0, 50)) // Keep last 50 activities
  }

  // Create checkpoint helper
  const createCheckpoint = (title?: string, description?: string) => {
    const checkpoint: Checkpoint = {
      id: `checkpoint-${Date.now()}`,
      title: title || `Checkpoint ${checkpoints.length + 1}`,
      description: description || `Saved at ${messages.length} messages`,
      timestamp: new Date(),
      messageCount: messages.length,
      type: title ? "manual" : "auto",
    }
    setCheckpoints(prev => [checkpoint, ...prev])
    setCurrentCheckpointId(checkpoint.id)
    
    addActivity({
      type: "completed",
      title: "Checkpoint created",
      description: checkpoint.title,
      status: "completed",
    })
  }

  // Restore checkpoint
  const restoreCheckpoint = (checkpointId: string) => {
    const checkpoint = checkpoints.find(c => c.id === checkpointId)
    if (checkpoint) {
      // In a real app, this would restore the actual message state
      setCurrentCheckpointId(checkpointId)
      addActivity({
        type: "completed",
        title: "Checkpoint restored",
        description: checkpoint.title,
        status: "completed",
      })
    }
  }

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

    messages.forEach((message) => {
      if (message.newSection) {
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
          messages: [message],
          isNewSection: true,
          isActive: true,
          sectionIndex: sections.length,
        }

        // Update active section ID
        setActiveSectionId(newSectionId)
      } else {
        // Add to current section
        currentSection.messages.push(message)
      }
    })

    // Add the last section if it has messages
    if (currentSection.messages.length > 0) {
      sections.push(currentSection)
    }

    setMessageSections(sections)
  }, [messages])

  // Auto-create checkpoint every 5 messages
  useEffect(() => {
    if (messages.length > 0 && messages.length % 5 === 0) {
      createCheckpoint(`Auto-save`, `After ${messages.length} messages`)
    }
  }, [messages.length])

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
    if (!isStreaming && shouldFocusAfterStreamingRef.current && !isMobile) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
      shouldFocusAfterStreamingRef.current = false
    }
  }, [isStreaming, isMobile])

  // Reset uploaded images when active button changes
  useEffect(() => {
    if (activeButtons.image === false) {
      // Don't clear images if we're submitting the form
      if (!isStreaming) {
        // setUploadedImages([])
      }
    }
  }, [activeButtons.image, isStreaming])

  const simulateTextStreaming = async (text: string) => {
    // Split text into words
    const words = text.split(" ")
    let currentIndex = 0
    setStreamingWords([])
    setIsStreaming(true)

    return new Promise<void>((resolve) => {
      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          // Add a few words at a time
          const nextIndex = Math.min(currentIndex + 2, words.length)
          const newWords = words.slice(currentIndex, nextIndex)

          setStreamingWords((prev) => [
            ...prev,
            {
              id: Date.now() + currentIndex,
              text: newWords.join(" ") + " ",
            },
          ])

          currentIndex = nextIndex
        } else {
          clearInterval(streamInterval)
          resolve()
        }
      }, 40)
    })
  }

  const simulateAIResponse = async (userMessage: string) => {
    const response = getAIResponse(userMessage)

    // Demo thinking content
    const thinkingContent = `Let me analyze this request carefully. The user is asking about "${userMessage}". I should consider multiple perspectives and provide a comprehensive response. First, I'll break down the key components of the question, then explore relevant context and connections. This will help me formulate a well-structured and informative answer.`

    // Demo tool calls
    const demoToolCalls: ToolCall[] = [
      {
        id: `tool-${Date.now()}-1`,
        name: "Web Search",
        status: "running",
        input: userMessage,
      },
      {
        id: `tool-${Date.now()}-2`,
        name: "Knowledge Base Query",
        status: "completed",
        input: `Query: ${userMessage.substring(0, 50)}...`,
        output: "Found relevant information in the knowledge base. Retrieved 3 documents with high relevance scores.",
      },
    ]

    // Add activity for response generation
    addActivity({
      type: "task",
      title: "Generating response",
      description: `Processing: "${userMessage.substring(0, 30)}..."`,
      status: "running",
      progress: 0,
    })

    // Create a new message with thinking and tool calls
    const messageId = Date.now().toString()
    setStreamingMessageId(messageId)

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        content: "",
        type: "system",
        thinking: thinkingContent,
        thinkingComplete: false,
        toolCalls: demoToolCalls,
      },
    ])

    // Add a delay before the second vibration
    setTimeout(() => {
      // Add vibration when streaming begins
      navigator.vibrate(50)
    }, 200)

    // Simulate thinking completion
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              thinkingComplete: true,
              toolCalls: msg.toolCalls?.map((tool) =>
                tool.status === "running"
                  ? {
                      ...tool,
                      status: "completed" as const,
                      output: "Search completed successfully. Found relevant results.",
                    }
                  : tool
              ),
            }
          : msg
      )
    )

    // Stream the text
    await simulateTextStreaming(response)

    // Update with complete message
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, content: response, completed: true } : msg)),
    )

    // Add to completed messages set to prevent re-animation
    setCompletedMessages((prev) => new Set(prev).add(messageId))

    // Update activity
    addActivity({
      type: "completed",
      title: "Response completed",
      description: `Replied to: "${userMessage.substring(0, 30)}..."`,
      status: "completed",
    })

    // Add vibration when streaming ends
    navigator.vibrate(50)

    // Reset streaming state
    setStreamingWords([])
    setStreamingMessageId(null)
    setIsStreaming(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((inputValue.trim() || uploadedImages.length > 0) && !isStreaming) {
      // Add vibration when message is submitted
      navigator.vibrate(50)

      const userMessage = inputValue.trim()

      // Add as a new section if messages already exist
      const shouldAddNewSection = messages.length > 0

      const newUserMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        type: "user" as const,
        newSection: shouldAddNewSection,
        images: uploadedImages.length > 0 ? [...uploadedImages] : undefined,
      }

      // Reset input before starting the AI response
      setInputValue("")
      setActiveButtons({
        add: false,
        tools: false,
        thinkLevel: "off",
        image: false,
        browser: false,
        selectedTools: [],
      })
      setUploadedImages([])

      // Add the message after resetting input
      setMessages((prev) => [...prev, newUserMessage])

      // On mobile, blur the textarea to dismiss the keyboard
      if (isMobile && textareaRef.current) {
        textareaRef.current.blur()
      }

      // Start AI response
      simulateAIResponse(userMessage)
    }
  }

  // Playbook handlers
  const handlePlaybookRun = (playbook: Playbook) => {
    const prompt = `Let's run the "${playbook.name}" playbook. Steps:\n${playbook.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    setInputValue(prompt)
    
    addActivity({
      type: "task",
      title: `Running playbook: ${playbook.name}`,
      description: playbook.description,
      status: "running",
    })
  }

  const handlePlaybookAdd = (playbook: Omit<Playbook, "id">) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: `playbook-${Date.now()}`,
    }
    setPlaybooks(prev => [...prev, newPlaybook])
  }

  const handlePlaybookDelete = (id: string) => {
    setPlaybooks(prev => prev.filter(p => p.id !== id))
  }

  // Memory handlers
  const handleMemoryEdit = (id: string, text: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, text } : m))
  }

  const handleMemoryDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div
      ref={mainContainerRef}
      className="bg-background flex flex-col overflow-hidden"
      style={{ height: isMobile ? `${viewportHeight}px` : "100svh" }}
    >
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      <ChatHeader 
        onActivityClick={handleOpenActivity}
        assistantName={onboardingData?.assistantName}
        activityCount={activities.filter(a => a.type === "thinking" || a.type === "searching" || a.type === "writing").length}
      />

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
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputAreaSimplified
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        isStreaming={isStreaming}
        isMobile={isMobile}
        activeButtons={activeButtons}
        setActiveButtons={setActiveButtons}
        textareaRef={textareaRef}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        memories={memories}
        onMemoryEdit={handleMemoryEdit}
        onMemoryDelete={handleMemoryDelete}
        checkpoints={checkpoints}
        currentCheckpointId={currentCheckpointId}
        onCheckpointRestore={restoreCheckpoint}
        onCheckpointCreate={() => createCheckpoint("Manual save", "User-created checkpoint")}
        playbooks={playbooks}
        onPlaybookRun={handlePlaybookRun}
        onPlaybookAdd={handlePlaybookAdd}
        onPlaybookDelete={handlePlaybookDelete}
        collaborationMode={collaborationMode}
        onCollaborationModeChange={setCollaborationMode}
      />
    </div>
  )
}
