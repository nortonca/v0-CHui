"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

interface Modal {
  id: string
  component: React.ReactNode
  onClose: () => void
}

interface ModalContextType {
  openModal: (id: string, component: React.ReactNode, onClose: () => void) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  modals: Modal[]
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([])

  const openModal = useCallback((id: string, component: React.ReactNode, onClose: () => void) => {
    setModals((prev) => [...prev, { id, component, onClose }])
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id)
      if (modal) {
        modal.onClose()
      }
      return prev.filter((m) => m.id !== id)
    })
  }, [])

  const closeAllModals = useCallback(() => {
    modals.forEach((modal) => modal.onClose())
    setModals([])
  }, [modals])

  // Handle ESC key - only close topmost modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modals.length > 0) {
        const topModal = modals[modals.length - 1]
        closeModal(topModal.id)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [modals, closeModal])

  // Lock body scroll when modals are open
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [modals.length])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals, modals }}>
      {children}
      {modals.map((modal, index) => (
        <ModalWrapper key={modal.id} index={index} onBackdropClick={() => closeModal(modal.id)}>
          {modal.component}
        </ModalWrapper>
      ))}
    </ModalContext.Provider>
  )
}

interface ModalWrapperProps {
  children: React.ReactNode
  index: number
  onBackdropClick: () => void
}

function ModalWrapper({ children, index, onBackdropClick }: ModalWrapperProps) {
  const baseZIndex = 1000
  const zIndex = baseZIndex + index * 10

  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onBackdropClick}
        aria-hidden="true"
      />
      {/* Modal content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within ModalProvider")
  }
  return context
}
