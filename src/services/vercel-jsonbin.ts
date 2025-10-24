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

// Vercel-compatible JSONBin service (readonly mode)
class VercelJSONBinService {
  private cache: JSONBinData | null = null
  private lastSync: number = 0
  private readonly CACHE_DURATION = 300000 // 5 minutes for readonly
  private binId: string
  private enabled: boolean

  constructor() {
    this.binId = process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || ''
    this.enabled = process.env.NEXT_PUBLIC_USE_JSONBIN === 'true' && !!this.binId
  }

  private get apiUrl() {
    return `https://api.jsonbin.io/v3/b/${this.binId}/latest`
  }

  private isCacheValid(): boolean {
    return this.cache !== null && (Date.now() - this.lastSync) < this.CACHE_DURATION
  }

  async fetchInitialData(): Promise<JSONBinData | null> {
    if (!this.enabled) {
      console.log('[JSONBin] Disabled - using localStorage only')
      return null
    }

    if (this.isCacheValid()) {
      return this.cache
    }

    // JSONBin disabled temporarily to avoid 401 errors
    console.log('[JSONBin] Temporarily disabled - using localStorage fallback')
    return null
  }

  async getStatus() {
    if (!this.enabled) {
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

  // Para uso con localStorage como fallback
  getLocalStorageData(): JSONBinData | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem('talentbridge_data')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  saveToLocalStorage(data: JSONBinData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('talentbridge_data', JSON.stringify(data))
        console.log('[VercelJSONBin] Data saved to localStorage')
      } catch (error) {
        console.warn('[VercelJSONBin] Error saving to localStorage:', error)
      }
    }
  }

  // Inicializar datos: usa localStorage únicamente (JSONBin deshabilitado)
  async initializeData(): Promise<JSONBinData> {
    console.log('[VercelJSONBin] Initializing data...')

    // JSONBin temporalmente deshabilitado para evitar errores 401
    console.log('[VercelJSONBin] JSONBin disabled - using localStorage only')

    // Intentar localStorage
    const localData = this.getLocalStorageData()
    if (localData && localData.users && localData.users.length > 0) {
      console.log('[VercelJSONBin] Using localStorage data')
      return localData
    }

    // Usar datos por defecto si no hay localStorage
    console.log('[VercelJSONBin] Using default data')
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