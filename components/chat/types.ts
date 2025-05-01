export interface ActiveButtonState {
  add: boolean
  deepSearch: boolean
  think: boolean
  image: boolean
  browser: boolean
}
export type MessageType = "user" | "system"

export interface Message {
  id: string
  content: string
  type: MessageType
  completed?: boolean
  newSection?: boolean
  images?: UploadedImage[]
}

export interface UploadedImage {
  id: string
  url: string
  thumbnail: string
}

export interface MessageSection {
  id: string
  messages: Message[]
  isNewSection: boolean
  isActive?: boolean
  sectionIndex: number
}

export interface StreamingWord {
  id: number
  text: string
}

// Constants for layout calculations
export const WORD_DELAY = 40 // ms per word
export const CHUNK_SIZE = 2 // Number of words to add at once
export const HEADER_HEIGHT = 48 // 12px height + padding
export const INPUT_AREA_HEIGHT = 100 // Approximate height of input area with padding
export const TOP_PADDING = 48 // pt-12 (3rem = 48px)
export const BOTTOM_PADDING = 128 // pb-32 (8rem = 128px)
export const ADDITIONAL_OFFSET = 16 // Reduced offset for fine-tuning
