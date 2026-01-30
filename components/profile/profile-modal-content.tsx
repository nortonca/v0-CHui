"use client"

import { X, User, Briefcase, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProfileModalContentProps {
  onClose: () => void
}

const TECHNICAL_LEVELS = [
  { id: "beginner", label: "Beginner", description: "Simple explanations, avoid jargon" },
  { id: "intermediate", label: "Intermediate", description: "Some technical terms are fine" },
  { id: "advanced", label: "Advanced", description: "Full technical depth" },
]

export default function ProfileModalContent({ onClose }: ProfileModalContentProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [primaryUse, setPrimaryUse] = useState("")
  const [technicalLevel, setTechnicalLevel] = useState("intermediate")
  const [activeProjects, setActiveProjects] = useState("")
  const [constraints, setConstraints] = useState("")
  const [avoidList, setAvoidList] = useState("")

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-lg max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="profile-modal-title" className="text-lg font-semibold text-foreground">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close profile"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* About You Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">About You</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Help the assistant understand who you are and how to best assist you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  What should I call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or nickname"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  What do you do?
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software developer, Designer, Student"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  What do you primarily use this for?
                </label>
                <textarea
                  value={primaryUse}
                  onChange={(e) => setPrimaryUse(e.target.value)}
                  placeholder="e.g., Writing code, Research, Learning new topics"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "resize-none h-20"
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Technical level
                </label>
                <div className="space-y-2">
                  {TECHNICAL_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setTechnicalLevel(level.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                        "hover:bg-muted/50",
                        technicalLevel === level.id && "bg-primary/5 border border-primary/20"
                      )}
                    >
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 transition-colors",
                          technicalLevel === level.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}>
                          {technicalLevel === level.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{level.label}</div>
                        <div className="text-xs text-muted-foreground">{level.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Context Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Context</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Optional information that improves response quality.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Active projects or goals
                </label>
                <textarea
                  value={activeProjects}
                  onChange={(e) => setActiveProjects(e.target.value)}
                  placeholder="What are you currently working on?"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "resize-none h-20"
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Preferences or constraints
                </label>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g., Time limits, preferred tools, platforms"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "resize-none h-20"
                  )}
                />
              </div>
            </div>
          </section>

          {/* Avoid Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Things to Avoid</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Anything the assistant should never do or suggest.
            </p>

            <textarea
              value={avoidList}
              onChange={(e) => setAvoidList(e.target.value)}
              placeholder="e.g., Don't use certain libraries, avoid specific patterns"
              className={cn(
                "w-full px-3 py-2.5 rounded-xl border border-border bg-background",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "resize-none h-24"
              )}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}
