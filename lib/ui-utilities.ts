/**
 * Shared utility functions for UI interactions and feedback
 */

/**
 * Trigger device vibration feedback
 */
export function triggerVibration(pattern: number | number[] = 50): void {
  if (navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Smooth scroll to element
 */
export function smoothScrollToElement(element: HTMLElement, behavior: ScrollBehavior = "smooth"): void {
  element.scrollIntoView({ behavior, block: "end" })
}

/**
 * Smooth scroll to position
 */
export function smoothScrollToPosition(
  container: HTMLElement,
  targetPosition: number,
  duration: number = 300
): void {
  const startPosition = container.scrollTop
  const distance = targetPosition - startPosition
  let start: number | null = null

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime
    const timeElapsed = currentTime - start
    const easeInOutQuad = (t: number): number => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    const run = easeInOutQuad(timeElapsed / duration)

    container.scrollTop = startPosition + distance * run

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Check if element is visible in viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    }
  } catch {
    return false
  }
}
