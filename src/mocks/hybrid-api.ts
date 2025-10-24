import { jsonBinService } from '../services/jsonbin'
import { mockApi } from './api'

// Wrapper que extiende mockApi con capacidades de JSONBin
class HybridApi {
  private useJSONBin: boolean

  constructor() {
    this.useJSONBin = process.env.NEXT_PUBLIC_USE_JSONBIN === 'true'
    console.log(`[HybridApi] JSONBin ${this.useJSONBin ? 'ENABLED' : 'DISABLED'}`)
  }

  private async syncToJSONBin() {
    if (!this.useJSONBin) return

    try {
      // Get current localStorage data
      const localData = this.getLocalStorageData()
      if (localData) {
        await jsonBinService.saveData(localData)
        console.log('[HybridApi] Data synced to JSONBin')
      }
    } catch (error) {
      console.warn('[HybridApi] Failed to sync to JSONBin:', error)
    }
  }

  private async syncFromJSONBin() {
    if (!this.useJSONBin) return

    try {
      const remoteData = await jsonBinService.fetchData()
      if (remoteData) {
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('talentbridge_data', JSON.stringify(remoteData))
        }
        // Force mockApi to reload
        mockApi.reloadFromStorage()
        console.log('[HybridApi] Data synced from JSONBin')
      }
    } catch (error) {
      console.warn('[HybridApi] Failed to sync from JSONBin:', error)
    }
  }

  private getLocalStorageData() {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem('talentbridge_data')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  // Initialize the hybrid system
  async initialize() {
    if (this.useJSONBin) {
      console.log('[HybridApi] Initializing with JSONBin...')
      await jsonBinService.initializeData()
      
      // Try to sync from remote first
      await this.syncFromJSONBin()
    } else {
      console.log('[HybridApi] Running in localStorage-only mode')
    }
  }

  // Wrapper methods that add JSONBin sync
  async login(email: string, password: string) {
    const result = await mockApi.login(email, password)
    // No need to sync on login
    return result
  }

  async register(name: string, email: string, password: string, role: any) {
    const result = await mockApi.register(name, email, password, role)
    await this.syncToJSONBin()
    return result
  }

  async createApplication(practiceId: string, userId: string) {
    const result = await mockApi.applyToPractice(practiceId, userId)
    await this.syncToJSONBin()
    return result
  }

  async updateApplicationStatus(applicationId: string, newStatus: any, updatedBy: string) {
    const result = await mockApi.updateApplicationStatus(applicationId, newStatus, updatedBy)
    await this.syncToJSONBin()
    return result
  }

  async createThreadForApplication(practiceId: string, applicantUserId: string) {
    const result = await mockApi.createThreadForApplication(practiceId, applicantUserId)
    await this.syncToJSONBin()
    return result
  }

  async sendMessage(threadId: string, senderId: string, content: string) {
    const result = await mockApi.sendMessage(threadId, senderId, content)
    await this.syncToJSONBin()
    return result
  }

  // Read-only methods (no sync needed)
  async listPractices(filters?: any) {
    await this.syncFromJSONBin()
    return mockApi.listPractices(filters)
  }

  async listApplications(filter?: string, userId?: string) {
    await this.syncFromJSONBin()
    const userIdToUse = filter === "user" && userId ? userId : "all"
    return mockApi.listApplications(userIdToUse)
  }

  async listUsers() {
    await this.syncFromJSONBin()
    return mockApi.listUsers?.() || []
  }

  async getPractice(id: string) {
    await this.syncFromJSONBin()
    return mockApi.getPractice(id)
  }

  async listThreads() {
    await this.syncFromJSONBin()
    return mockApi.listThreads()
  }

  async getThread(threadId: string) {
    await this.syncFromJSONBin()
    return mockApi.getThread(threadId)
  }

  async getMessages(_threadId: string) {
    await this.syncFromJSONBin()
    // For now, delegate to mockApi without syncing since getMessages doesn't exist
    // This will be handled by the thread functionality
    return []
  }

  // Utility methods
  logout() {
    return mockApi.logout()
  }

  reloadFromStorage() {
    return mockApi.reloadFromStorage()
  }

  // JSONBin specific methods
  async getServiceStatus() {
    if (!this.useJSONBin) {
      return {
        jsonBinEnabled: false,
        connected: false,
        lastSync: null,
        cacheValid: false
      }
    }
    return await jsonBinService.getStatus()
  }

  async forceSync() {
    if (!this.useJSONBin) return false

    try {
      await this.syncToJSONBin()
      await this.syncFromJSONBin()
      return true
    } catch (error) {
      console.error('[HybridApi] Force sync failed:', error)
      return false
    }
  }

  async migrateToJSONBin() {
    if (!this.useJSONBin) {
      throw new Error('JSONBin is not enabled')
    }

    try {
      await jsonBinService.migrateFromLocalStorage()
      console.log('[HybridApi] Migration to JSONBin completed')
      return true
    } catch (error) {
      console.error('[HybridApi] Migration failed:', error)
      return false
    }
  }

  // Enable/disable JSONBin at runtime (for testing)
  setJSONBinEnabled(enabled: boolean) {
    this.useJSONBin = enabled
    console.log(`[HybridApi] JSONBin ${enabled ? 'ENABLED' : 'DISABLED'} at runtime`)
  }
}

// Export singleton instance
export const hybridApi = new HybridApi()

// Also export the original mockApi for backwards compatibility
export { mockApi }