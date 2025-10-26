import axios from 'axios'
import type { User, Practice, Application, Thread, Message } from "../types"
import { OptimizedStorage } from "../utils/performance"
import { getJSONBinConfig } from "../config/jsonbin.config"

// Types
interface JSONBinData {
  users: User[]
  practices: Practice[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

// Vercel-compatible JSONBin service (readonly mode with performance optimization)
class VercelJSONBinService {
  private cache: JSONBinData | null = null
  private lastSync: number = 0
  private readonly CACHE_DURATION = 300000 // 5 minutes for readonly
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
      console.log('[VercelJSONBin] ✅ Initialized with Bin ID:', this.config.binId.substring(0, 10) + '...')
    } else {
      console.log('[VercelJSONBin] ⚠️ Disabled - using localStorage only')
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
      console.log('[VercelJSONBin] ⚠️ Disabled - using localStorage only')
      return null
    }

    console.log('[VercelJSONBin] 🌐 Fetching data from cloud...')
    
    if (this.isCacheValid()) {
      console.log('[VercelJSONBin] ⚡ Using cached data')
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
      console.log('[VercelJSONBin] ✅ Data fetched successfully from cloud')
      return this.cache
    } catch (error) {
      console.error('[VercelJSONBin] ❌ Failed to fetch from cloud:', error)
      return null
    }
  }

  async getStatus() {
    if (!this.isEnabled()) {
      return {
        enabled: false,
        connected: false,
        mode: 'localStorage-only',
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
      mode: 'readonly',
      lastSync: this.lastSync > 0 ? new Date(this.lastSync) : null
    }
  }

  // Para uso con localStorage como fallback optimizado
  getLocalStorageData(): JSONBinData | null {
    if (typeof window === 'undefined') return null

    try {
      // Use optimized storage with caching
      const stored = OptimizedStorage.get('talentbridge_data')
      return stored
    } catch {
      return null
    }
  }

  saveToLocalStorage(data: JSONBinData): void {
    if (typeof window !== 'undefined') {
      try {
        // Use optimized storage
        OptimizedStorage.set('talentbridge_data', data)
        console.log('[VercelJSONBin] Data saved to optimized localStorage')
      } catch (error) {
        console.warn('[VercelJSONBin] Error saving to localStorage:', error)
      }
    }
  }

  // Guardar datos en JSONBin (para sincronizar usuarios registrados)
  async saveData(data: JSONBinData): Promise<boolean> {
    if (!this.isEnabled()) {
      console.log('[VercelJSONBin] ⚠️ Save disabled - using localStorage only')
      this.saveToLocalStorage(data)
      return false
    }

    try {
      const apiKey = this.getApiKey()
      if (!apiKey) {
        console.warn('[VercelJSONBin] ❌ No API key configured')
        this.saveToLocalStorage(data)
        return false
      }

      console.log('[VercelJSONBin] 💾 Saving data to cloud...')
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
      
      // Actualizar cache
      this.cache = data
      this.lastSync = Date.now()
      
      // También guardar en localStorage como backup
      this.saveToLocalStorage(data)
      
      console.log('[JSONBin] Data saved to cloud successfully')
      return true
    } catch (error) {
      console.error('[JSONBin] Error saving data:', error)
      // Guardar en localStorage como fallback
      this.saveToLocalStorage(data)
      return false
    }
  }

  // Inicializar datos: intenta JSONBin primero, luego localStorage
  async initializeData(): Promise<JSONBinData> {
    console.log('[VercelJSONBin] 🚀 Initializing data...')

    // Intentar cargar desde JSONBin si está habilitado
    if (this.isEnabled()) {
      console.log('[VercelJSONBin] 🌐 Attempting to fetch from cloud...')
      const cloudData = await this.fetchInitialData()
      if (cloudData) {
        console.log('[VercelJSONBin] ✅ Using cloud data')
        return cloudData
      }
      console.log('[VercelJSONBin] ⚠️ Cloud fetch failed, falling back to localStorage')
    }

    // Intentar localStorage
    const localData = this.getLocalStorageData()
    if (localData && localData.users && localData.users.length > 0) {
      console.log('[VercelJSONBin] 📦 Using localStorage data')
      return localData
    }

    // Usar datos por defecto si no hay localStorage
    console.log('[VercelJSONBin] 🆕 Using default data (first time setup)')
    const defaultData = this.getDefaultData()
    this.saveToLocalStorage(defaultData)
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

// Export singleton instance for Vercel
export const vercelJsonBinService = new VercelJSONBinService()