import axios from 'axios'
import type { User, Practice, Application, Thread, Message } from "../types"

// Types
interface JSONBinData {
  users: User[]
  practices: Practice[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

interface JSONBinConfig {
  binId: string
  secretKey: string
  useJSONBin: boolean
}

class JSONBinService {
  private config: JSONBinConfig
  private cache: JSONBinData | null = null
  private lastSync: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds

  constructor() {
    this.config = {
      binId: process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || '',
      secretKey: process.env.JSONBIN_SECRET_KEY || '',
      useJSONBin: process.env.NEXT_PUBLIC_USE_JSONBIN === 'true'
    }
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': this.config.secretKey,
      'X-Bin-Name': 'TalentBridge Data'
    }
  }

  private get apiUrl() {
    return `https://api.jsonbin.io/v3/b/${this.config.binId}`
  }

  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.lastSync) < this.CACHE_DURATION
  }

  async fetchData(): Promise<JSONBinData> {
    console.log('[JSONBin] Fetching data...')

    if (!this.config.useJSONBin) {
      console.log('[JSONBin] JSONBin disabled, using localStorage fallback')
      return this.getLocalStorageData()
    }

    if (this.isCacheValid()) {
      console.log('[JSONBin] Using cached data')
      return this.cache!
    }

    try {
      const response = await axios.get(this.apiUrl + '/latest', {
        headers: this.headers
      })

      this.cache = response.data.record
      this.lastSync = Date.now()
      
      console.log('[JSONBin] Data fetched successfully from remote')
      
      // Also save to localStorage as backup
      if (this.cache) {
        this.saveToLocalStorage(this.cache)
      }
      
      return this.cache!

    } catch (error: any) {
      console.warn('[JSONBin] Failed to fetch from remote, using localStorage fallback:', error.message)
      return this.getLocalStorageData()
    }
  }

  async saveData(data: JSONBinData): Promise<void> {
    console.log('[JSONBin] Saving data...')

    // Always save to localStorage first (immediate)
    this.saveToLocalStorage(data)
    this.cache = data
    this.lastSync = Date.now()

    if (!this.config.useJSONBin) {
      console.log('[JSONBin] JSONBin disabled, only saved locally')
      return
    }

    try {
      await axios.put(this.apiUrl, data, {
        headers: this.headers
      })
      
      console.log('[JSONBin] Data saved successfully to remote')
      
      // Dispatch event for real-time updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
      }

    } catch (error: any) {
      console.warn('[JSONBin] Failed to save to remote, but saved locally:', error.message)
      // Still dispatch event for local updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
      }
    }
  }

  private getLocalStorageData(): JSONBinData {
    if (typeof window === 'undefined') {
      return this.getDefaultData()
    }

    try {
      const stored = localStorage.getItem('talentbridge_data')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure all required fields exist
        return {
          users: parsed.users || [],
          practices: parsed.practices || [],
          applications: parsed.applications || [],
          threads: parsed.threads || [],
          messages: parsed.messages || [],
          ...parsed
        }
      }
    } catch (error) {
      console.warn('[JSONBin] Error reading localStorage:', error)
    }

    return this.getDefaultData()
  }

  private saveToLocalStorage(data: JSONBinData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('talentbridge_data', JSON.stringify(data))
      } catch (error) {
        console.warn('[JSONBin] Error saving to localStorage:', error)
      }
    }
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
          about: "Estudiante de Ingeniería en Sistemas apasionada por el desarrollo web y las tecnologías emergentes. Busco oportunidades para aplicar mis conocimientos en React, JavaScript y diseño de interfaces.",
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
          description: "Buscamos un estudiante apasionado por el desarrollo frontend para unirse a nuestro equipo. Trabajarás en proyectos reales con tecnologías modernas.",
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

  // Initialize data if needed
  async initializeData(): Promise<void> {
    console.log('[JSONBin] Initializing data...')
    
    try {
      const data = await this.fetchData()
      
      // If we have no data or very little data, initialize with defaults
      if (!data.users || data.users.length === 0) {
        console.log('[JSONBin] No data found, initializing with defaults')
        await this.saveData(this.getDefaultData())
      }
      
    } catch (error) {
      console.warn('[JSONBin] Error during initialization:', error)
      // Initialize with defaults
      await this.saveData(this.getDefaultData())
    }
  }

  // Migration helper
  async migrateFromLocalStorage(): Promise<void> {
    console.log('[JSONBin] Starting migration from localStorage...')
    
    const localData = this.getLocalStorageData()
    
    // Only migrate if we have meaningful data
    if (localData.users.length > 3 || localData.applications.length > 0) {
      console.log('[JSONBin] Found local data to migrate')
      await this.saveData(localData)
      console.log('[JSONBin] Migration completed successfully')
    } else {
      console.log('[JSONBin] No significant local data to migrate')
    }
  }

  // Status check
  async getStatus(): Promise<{
    jsonBinEnabled: boolean
    connected: boolean
    lastSync: Date | null
    cacheValid: boolean
  }> {
    let connected = false
    
    if (this.config.useJSONBin) {
      try {
        await axios.get(this.apiUrl + '/latest', { headers: this.headers })
        connected = true
      } catch {
        connected = false
      }
    }

    return {
      jsonBinEnabled: this.config.useJSONBin,
      connected,
      lastSync: this.lastSync > 0 ? new Date(this.lastSync) : null,
      cacheValid: this.isCacheValid()
    }
  }
}

// Export singleton instance
export const jsonBinService = new JSONBinService()