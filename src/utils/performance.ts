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

// Optimize localStorage operations with caching
export class OptimizedStorage {
  private static cache = new Map<string, any>()
  private static cacheTimeout = 5000 // 5 seconds cache
  private static cacheTimestamps = new Map<string, number>()
  
  static get(key: string) {
    const now = Date.now()
    const timestamp = this.cacheTimestamps.get(key) || 0
    
    // Return cached value if still fresh
    if (this.cache.has(key) && (now - timestamp) < this.cacheTimeout) {
      return this.cache.get(key)
    }
    
    if (typeof window !== 'undefined') {
      try {
        const value = localStorage.getItem(key)
        const parsed = value ? JSON.parse(value) : null
        this.cache.set(key, parsed)
        this.cacheTimestamps.set(key, now)
        return parsed
      } catch {
        return null
      }
    }
    return null
  }
  
  static set(key: string, value: any) {
    const now = Date.now()
    this.cache.set(key, value)
    this.cacheTimestamps.set(key, now)
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
      }
    }
  }
  
  static clear() {
    this.cache.clear()
    this.cacheTimestamps.clear()
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear()
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }
  }
  
  static clearCache() {
    this.cache.clear()
    this.cacheTimestamps.clear()
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
      if (duration > 100) { // Only log slow operations
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
      const batch = this.queue.splice(0, 10) // Process 10 at a time
      batch.forEach(task => task())
      
      // Yield to browser between batches
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    this.processing = false
  }
}

export default {
  debounce,
  throttle,
  OptimizedStorage,
  PerformanceMonitor,
  BatchProcessor
}