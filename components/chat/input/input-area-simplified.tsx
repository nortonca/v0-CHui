"use client"

import type React from "react"
import { useState, useRef } from "react"
import type { ActiveButtonState, UploadedImage } from "../types"
import type { Memory } from "../memory-panel"
import type { Checkpoint } from "../checkpoints-panel"
import type { Playbook } from "../playbooks-panel"
import type { Task } from "../task-panel"
import type { CollaborationMode } from "../collaboration-mode"
import QuickActions from "../quick-actions"
import MemoryPanel from "../memory-panel"
import TaskPanel from "../task-panel"
import PlaybooksPanel from "../playbooks-panel"
import CheckpointsPanel from "../checkpoints-panel"
import InputBar from "./input-bar"

interface InputAreaSimplifiedProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButtons: ActiveButtonState
  setActiveButtons: (buttons: ActiveButtonState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  uploadedImages: UploadedImage[]
  setUploadedImages: (images: UploadedImage[]) => void
  // Memory
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  // Checkpoints
  checkpoints: Checkpoint[]
  currentCheckpointId?: string
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  // Playbooks
  playbooks: Playbook[]
  onPlaybookRun: (playbook: Playbook) => void
  onPlaybookAdd: (playbook: Omit<Playbook, "id">) => void
  onPlaybookDelete: (id: string) => void
  // Collaboration mode
  collaborationMode: CollaborationMode
  onCollaborationModeChange: (mode: CollaborationMode) => void
}

export default function InputAreaSimplified({
  inputValue,
  setInputValue,
  handleSubmit,
  isStreaming,
  isMobile,
  activeButtons,
  setActiveButtons,
  textareaRef,
  uploadedImages,
  setUploadedImages,
  memories,
  onMemoryEdit,
  onMemoryDelete,
  checkpoints,
  currentCheckpointId,
  onCheckpointRestore,
  onCheckpointCreate,
  playbooks,
  onPlaybookRun,
  onPlaybookAdd,
  onPlaybookDelete,
  collaborationMode,
  onCollaborationModeChange,
}: InputAreaSimplifiedProps) {
  // Panel expansion states
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false)
  const [isMemoryPanelExpanded, setIsMemoryPanelExpanded] = useState(false)
  const [isPlaybooksPanelExpanded, setIsPlaybooksPanelExpanded] = useState(false)
  const [isCheckpointsPanelExpanded, setIsCheckpointsPanelExpanded] = useState(false)
  
  // Tasks state (local to input area)
  const [tasks, setTasks] = useState<Task[]>([])

  // Toggle panel with exclusive behavior
  const togglePanel = (panel: "task" | "memory" | "playbooks" | "checkpoints") => {
    const isCurrentlyOpen = 
      (panel === "task" && isTaskPanelExpanded) ||
      (panel === "memory" && isMemoryPanelExpanded) ||
      (panel === "playbooks" && isPlaybooksPanelExpanded) ||
      (panel === "checkpoints" && isCheckpointsPanelExpanded)

    // Close all panels first
    setIsTaskPanelExpanded(false)
    setIsMemoryPanelExpanded(false)
    setIsPlaybooksPanelExpanded(false)
    setIsCheckpointsPanelExpanded(false)

    // If the panel was closed, open it
    if (!isCurrentlyOpen) {
      switch (panel) {
        case "task":
          setIsTaskPanelExpanded(true)
          break
        case "memory":
          setIsMemoryPanelExpanded(true)
          break
        case "playbooks":
          setIsPlaybooksPanelExpanded(true)
          break
        case "checkpoints":
          setIsCheckpointsPanelExpanded(true)
          break
      }
    }
  }

  // Task management
  const handleTaskToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleTaskAdd = (text: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      addedBy: "user",
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleTaskEdit = (id: string, text: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text } : task
      )
    )
  }

  const handleTaskDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // Quick action handler
  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textareaRef.current.scrollHeight, 160))
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
      {/* Quick Actions Bar */}
      <QuickActions
        onActionSelect={handleQuickAction}
        isStreaming={isStreaming}
        className="mb-3 max-w-3xl mx-auto"
      />

      {/* Panels Container */}
      <div className="relative max-w-3xl mx-auto">
        {/* Memory Panel */}
        <MemoryPanel
          isExpanded={isMemoryPanelExpanded}
          onToggle={() => togglePanel("memory")}
          memories={memories}
          onMemoryEdit={onMemoryEdit}
          onMemoryDelete={onMemoryDelete}
          isMobile={isMobile}
        />

        {/* Task Panel */}
        <TaskPanel
          isExpanded={isTaskPanelExpanded}
          onToggle={() => togglePanel("task")}
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onTaskAdd={handleTaskAdd}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          isMobile={isMobile}
        />

        {/* Playbooks Panel */}
        <PlaybooksPanel
          isExpanded={isPlaybooksPanelExpanded}
          onToggle={() => togglePanel("playbooks")}
          playbooks={playbooks}
          onPlaybookRun={onPlaybookRun}
          onPlaybookAdd={onPlaybookAdd}
          onPlaybookDelete={onPlaybookDelete}
          isMobile={isMobile}
        />

        {/* Checkpoints Panel */}
        <CheckpointsPanel
          isExpanded={isCheckpointsPanelExpanded}
          onToggle={() => togglePanel("checkpoints")}
          checkpoints={checkpoints}
          currentCheckpointId={currentCheckpointId}
          onRestore={onCheckpointRestore}
          onCreateCheckpoint={onCheckpointCreate}
          isMobile={isMobile}
        />

        {/* Input Bar */}
        <InputBar
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
          isMemoryPanelExpanded={isMemoryPanelExpanded}
          isTaskPanelExpanded={isTaskPanelExpanded}
          isPlaybooksPanelExpanded={isPlaybooksPanelExpanded}
          isCheckpointsPanelExpanded={isCheckpointsPanelExpanded}
          memoriesCount={memories.length}
          tasksCount={tasks.length}
          tasksCompletedCount={tasks.filter(t => t.completed).length}
          checkpointsCount={checkpoints.length}
          collaborationMode={collaborationMode}
          onTogglePanel={togglePanel}
          onCollaborationModeChange={onCollaborationModeChange}
        />
      </div>
    </div>
  )
}
