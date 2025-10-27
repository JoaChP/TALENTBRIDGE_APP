// Performance optimization utilities for TalentBridge

// Debounce function to prevent excessive function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static marks = new Map<string, number>()
  private static enabled = true
  
  static disable() {
    this.enabled = false
  }
  
  static enable() {
    this.enabled = true
  }
  
  static start(label: string) {
    if (!this.enabled) return
    this.marks.set(label, performance.now())
  }
  
  static end(label: string) {
    if (!this.enabled) return 0
    
    const start = this.marks.get(label)
    if (start) {
      const duration = performance.now() - start
      if (duration > 100) {
        console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
      }
      this.marks.delete(label)
      return duration
    }
    return 0
  }
  
  static measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }
}

// Simple batch processor to reduce UI blocking
export class BatchProcessor {
  private static queue: Array<() => void> = []
  private static processing = false
  
  static add(task: () => void) {
    this.queue.push(task)
    this.process()
  }
  
  private static async process() {
    if (this.processing) return
    this.processing = true
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, 10)
      batch.forEach(task => task())
      
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    this.processing = false
  }
}

export default {
  debounce,
  throttle,
  PerformanceMonitor,
  BatchProcessor
}
