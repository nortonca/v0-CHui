"use client"

import React from "react"

import { Sparkles, FileText, Search, CheckCircle, MessageSquare, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
  description: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "summarize",
    label: "Summarize",
    icon: <FileText className="size-4" />,
    prompt: "Summarize the key points from our conversation so far",
    description: "Get a concise summary",
  },
  {
    id: "plan",
    label: "Plan",
    icon: <Lightbulb className="size-4" />,
    prompt: "Help me create a plan for what we discussed",
    description: "Create an action plan",
  },
  {
    id: "review",
    label: "Review",
    icon: <CheckCircle className="size-4" />,
    prompt: "Review what we've accomplished and suggest next steps",
    description: "Progress check-in",
  },
  {
    id: "research",
    label: "Research",
    icon: <Search className="size-4" />,
    prompt: "Research this topic and give me a comprehensive overview",
    description: "Deep dive research",
  },
  {
    id: "followup",
    label: "Follow-up",
    icon: <MessageSquare className="size-4" />,
    prompt: "What are the most important follow-up questions I should consider?",
    description: "Ask follow-up questions",
  },
  {
    id: "brainstorm",
    label: "Brainstorm",
    icon: <Sparkles className="size-4" />,
    prompt: "Let's brainstorm creative ideas and approaches for this",
    description: "Generate ideas",
  },
]

interface QuickActionsProps {
  onActionSelect: (prompt: string) => void
  isStreaming?: boolean
  className?: string
}

export default function QuickActions({
  onActionSelect,
  isStreaming = false,
  className,
}: QuickActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1", className)}>
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onActionSelect(action.prompt)}
          disabled={isStreaming}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
            "border border-border bg-background hover:bg-muted/50",
            "text-sm font-medium text-foreground whitespace-nowrap",
            "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            "group"
          )}
          title={action.description}
        >
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            {action.icon}
          </span>
          {action.label}
        </button>
      ))}
    </div>
  )
}
