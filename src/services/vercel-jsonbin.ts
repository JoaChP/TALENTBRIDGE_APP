import axios from 'axios'
import type { User, Practice, Application, Thread, Message } from "../types"
import { getJSONBinConfig } from "../config/jsonbin.config"

// Types
interface JSONBinData {
  users: User[]
  practices: Practice[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

// JSONBin service - single source of truth for data storage
class VercelJSONBinService {
  private cache: JSONBinData | null = null
  private lastSync: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds cache
  private config = getJSONBinConfig()

  private getBinId(): string {
    return this.config.binId
  }

  private isEnabled(): boolean {
    return this.config.enabled
  }

  private getApiKey(): string {
    return this.config.apiKey
  }

  constructor() {
    if (this.isEnabled()) {
      console.log('[JSONBin] ✅ Initialized with Bin ID:', this.config.binId.substring(0, 10) + '...')
    } else {
      console.warn('[JSONBin] ⚠️ Not configured properly - check credentials')
    }
  }

  private get apiUrl() {
    return `https://api.jsonbin.io/v3/b/${this.getBinId()}/latest`
  }

  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.lastSync) < this.CACHE_DURATION
  }

  async fetchInitialData(): Promise<JSONBinData | null> {
    if (!this.isEnabled()) {
      console.error('[JSONBin] ❌ Not configured - cannot fetch data')
      return null
    }

    console.log('[JSONBin] 🌐 Fetching data from cloud...')
    
    if (this.isCacheValid()) {
      console.log('[JSONBin] ⚡ Using cached data')
      return this.cache
    }

    try {
      const apiKey = this.getApiKey()
      const response = await axios.get(this.apiUrl, {
        headers: {
          'X-Master-Key': apiKey,
        }
      })
      
      this.cache = response.data.record
      this.lastSync = Date.now()
      console.log('[JSONBin] ✅ Data fetched successfully from cloud')
      return this.cache
    } catch (error) {
      console.error('[JSONBin] ❌ Failed to fetch from cloud:', error)
      return null
    }
  }

  async getStatus() {
    if (!this.isEnabled()) {
      return {
        enabled: false,
        connected: false,
        mode: 'not-configured',
        lastSync: null
      }
    }

    let connected = false
    try {
      await axios.get(this.apiUrl)
      connected = true
    } catch {
      connected = false
    }

    return {
      enabled: true,
      connected,
      mode: 'jsonbin-only',
      lastSync: this.lastSync > 0 ? new Date(this.lastSync) : null
    }
  }

  // Save data to JSONBin
  async saveData(data: JSONBinData): Promise<boolean> {
    if (!this.isEnabled()) {
      console.error('[JSONBin] ❌ Not configured - cannot save data')
      return false
    }

    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        console.error('[JSONBin] ❌ No API key configured')
        return false
      }

      console.log('[JSONBin] 💾 Saving data to cloud...')
      await axios.put(
        `https://api.jsonbin.io/v3/b/${this.getBinId()}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey,
          }
        }
      )
      
      // Update cache
      this.cache = data
      this.lastSync = Date.now()
      
      console.log('[JSONBin] ✅ Data saved to cloud successfully')
      return true
    } catch (error) {
      console.error('[JSONBin] ❌ Error saving data:', error)
      return false
    }
  }

  // Initialize data from JSONBin
  async initializeData(): Promise<JSONBinData> {
    console.log('[JSONBin] 🚀 Initializing data...')

    if (this.isEnabled()) {
      console.log('[JSONBin] 🌐 Fetching from cloud...')
      const cloudData = await this.fetchInitialData()
      if (cloudData) {
        console.log('[JSONBin] ✅ Using cloud data')
        return cloudData
      }
      console.log('[JSONBin] ⚠️ Cloud fetch failed')
    }

    // Use default data if JSONBin is not available
    console.log('[JSONBin] 🆕 Using default data')
    const defaultData = this.getDefaultData()
    
    // Try to save default data to JSONBin
    if (this.isEnabled()) {
      await this.saveData(defaultData)
    }
    
    return defaultData
  }

  private getDefaultData(): JSONBinData {
    return {
      users: [
        {
          id: "1",
          name: "Ana García",
          email: "estudiante@demo.com",
          role: "estudiante",
          phone: "+52 55 1234 5678",
          about: "Estudiante de Ingeniería en Sistemas apasionada por el desarrollo web y las tecnologías emergentes.",
          avatarUrl: "/estudiante-mujer-profesional.jpg",
        },
        {
          id: "2",
          name: "TechCorp SA",
          email: "empresa@demo.com",
          role: "empresa",
          avatarUrl: "/technology-company-logo.jpg",
        },
        {
          id: "3",
          name: "Admin Sistema",
          email: "admin@demo.com",
          role: "admin",
          avatarUrl: "/admin-icon.jpg",
        },
      ],
      practices: [
        {
          id: "1",
          title: "Desarrollador Frontend React",
          company: {
            id: "c1",
            name: "TechCorp",
            logoUrl: "/tech-company-logo.jpg",
            isEmpresa: true,
            ownerUserId: "2",
          },
          city: "Ciudad de México",
          country: "México",
          modality: "Remoto",
          durationMonths: 6,
          postedAgo: "Hace 2 días",
          skills: ["React", "JavaScript", "CSS", "Git"],
          description: "Buscamos un estudiante apasionado por el desarrollo frontend para unirse a nuestro equipo.",
          status: "Publicada",
          vacancies: 2,
          benefits: "Mentoría personalizada, certificado al finalizar, posibilidad de contratación",
        }
      ],
      applications: [],
      threads: [],
      messages: []
    }
  }
}

// Export singleton instance
export const vercelJsonBinService = new VercelJSONBinService()