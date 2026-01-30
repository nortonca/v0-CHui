"use client"

import React from "react"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SettingsSectionProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}

export function SettingsSection({ icon: Icon, title, description, children }: SettingsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      {children}
    </section>
  )
}

interface RadioOption {
  id: string
  label: string
  description: string
}

interface SettingsRadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function SettingsRadioGroup({ options, value, onChange }: SettingsRadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
            "hover:bg-muted/50",
            value === option.id && "bg-primary/5 border border-primary/20"
          )}
        >
          <div className="flex-shrink-0">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 transition-colors",
              value === option.id
                ? "border-primary bg-primary"
                : "border-muted-foreground"
            )}>
              {value === option.id && (
                <div className="w-full h-full rounded-full bg-white scale-50" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">{option.label}</div>
            <div className="text-xs text-muted-foreground">{option.description}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

interface SettingsToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsToggle({ label, description, checked, onChange }: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-3",
          checked ? "bg-primary" : "bg-muted"
        )}
        aria-label={`Toggle ${label}`}
      >
        <div className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
          checked && "translate-x-5"
        )} />
      </button>
    </div>
  )
}

interface SettingsSliderProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  labels?: { value: number; label: string }[]
}

export function SettingsSlider({ 
  label, 
  description, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  labels 
}: SettingsSliderProps) {
  return (
    <div className="px-4 py-3 rounded-xl bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        </div>
        {labels && (
          <span className="text-sm font-medium text-primary">
            {labels.find(l => l.value === value)?.label || value}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((l) => (
            <span key={l.value} className="text-[10px] text-muted-foreground">{l.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
