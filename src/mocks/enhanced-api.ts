import { jsonBinService } from '../services/jsonbin'
import { mockApi as originalMockApi } from './api'
import type { User, Practice, Application, ApplicationStatus, Role } from "../types"

// Enhanced mock API that uses JSONBin as backend
class JSONBinMockApi {
  private initialized = false

  async ensureInitialized() {
    if (!this.initialized) {
      console.log('[JSONBinMockApi] Initializing...')
      await jsonBinService.initializeData()
      this.initialized = true
    }
  }

  async getData() {
    await this.ensureInitialized()
    return await jsonBinService.fetchData()
  }

  async saveData(data: any) {
    await jsonBinService.saveData(data)
  }

  // Helper to get current data
  private async getCurrentData() {
    return await this.getData()
  }

  // Initialize with migration support
  async initialize() {
    await this.ensureInitialized()
    
    // Check if we should migrate from localStorage
    const status = await jsonBinService.getStatus()
    if (status.jsonBinEnabled && !status.connected) {
      console.log('[JSONBinMockApi] JSONBin enabled but not connected, will try migration on first save')
    }
  }

  // Main API methods that delegate to JSONBin when enabled, localStorage otherwise
  async login(email: string, password: string) {
    const data = await this.getCurrentData()
    const user = data.users.find((u: User) => u.email === email)
    if (!user || password !== "123456") {
      throw new Error("Credenciales inválidas")
    }
    return { user, token: `token_${user.id}` }
  }

  async register(name: string, email: string, _password: string, role: Role) {
    const data = await this.getCurrentData()
    
    if (data.users.find((u: User) => u.email === email)) {
      throw new Error("El correo ya está registrado")
    }
    
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `/placeholder.svg?height=100&width=100&query=${role}`,
    }
    
    data.users.push(user)
    await this.saveData(data)
    
    return { user, token: `token_${user.id}` }
  }

  logout() {
    // No need to do anything for mock
  }

  async listPractices(_filters?: any) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const data = await this.getCurrentData()
    return data.practices.filter((p: Practice) => p.status === "Publicada")
  }

  async createApplication(practiceId: string, userId: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const data = await this.getCurrentData()
    
    const existingApplication = data.applications.find(
      (app: Application) => app.practiceId === practiceId && app.userId === userId
    )
    
    if (existingApplication) {
      throw new Error("Ya has aplicado a esta práctica")
    }

    const application: Application = {
      id: `app_${Date.now()}`,
      practiceId,
      userId,
      status: "Enviada",
      createdAt: new Date().toISOString(),
    }

    data.applications.push(application)
    await this.saveData(data)
    
    return application
  }

  async listApplications(filter: "all" | "user", userId?: string) {
    const data = await this.getCurrentData()
    
    if (filter === "user" && userId) {
      return data.applications.filter((app: Application) => app.userId === userId)
    }
    return data.applications
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    _updatedBy: string
  ) {
    const data = await this.getCurrentData()
    
    const application = data.applications.find((app: Application) => app.id === applicationId)
    if (!application) {
      throw new Error("Aplicación no encontrada")
    }

    application.status = newStatus
    await this.saveData(data)
    return application
  }

  async listUsers() {
    const data = await this.getCurrentData()
    return data.users
  }

  // Delegate other methods to original mockApi for now
  async createThreadForApplication(practiceId: string, applicantUserId: string) {
    return originalMockApi.createThreadForApplication(practiceId, applicantUserId)
  }

  async listThreads(_userId: string) {
    return originalMockApi.listThreads()
  }

  async getThread(threadId: string) {
    return originalMockApi.getThread(threadId)
  }

  async sendMessage(threadId: string, senderId: string, content: string) {
    return originalMockApi.sendMessage(threadId, senderId, content)
  }

  async getMessages(threadId: string) {
    return originalMockApi.listMessages(threadId)
  }

  async getPractice(id: string) {
    const data = await this.getCurrentData()
    return data.practices.find((p: Practice) => p.id === id)
  }

  // Utility methods
  reloadFromStorage() {
    console.log('[JSONBinMockApi] Forcing data reload...')
    originalMockApi.reloadFromStorage()
  }

  // Get service status
  async getServiceStatus() {
    return await jsonBinService.getStatus()
  }

  // Manual migration trigger
  async migrateFromLocalStorage() {
    return await jsonBinService.migrateFromLocalStorage()
  }
}

// Create enhanced instance
export const enhancedMockApi = new JSONBinMockApi()

// For backwards compatibility, also export the original
export { originalMockApi as mockApi }