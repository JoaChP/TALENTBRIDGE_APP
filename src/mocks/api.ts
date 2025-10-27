import type { User, Practice, Application, Thread, Message, Role, Skill, Modality, ApplicationStatus } from "../types"
import { vercelJsonBinService } from "../services/vercel-jsonbin"

interface MockData {
  users: User[]
  practices: Practice[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

// Default seed data used when JSONBin is empty or unavailable
export const defaultData: MockData = {
  users: [
    {
      id: "1",
      name: "Ana García",
      email: "estudiante@demo.com",
      role: "estudiante",
      phone: "+52 55 1234 5678",
      about:
        "Estudiante de Ingeniería en Sistemas apasionada por el desarrollo web y las tecnologías emergentes. Busco oportunidades para aplicar mis conocimientos en React, JavaScript y diseño de interfaces. Me encanta trabajar en equipo y aprender de cada proyecto. Tengo experiencia en proyectos académicos y personales donde he desarrollado aplicaciones web completas.",
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
      description:
        "Buscamos un estudiante apasionado por el desarrollo frontend para unirse a nuestro equipo. Trabajarás en proyectos reales con tecnologías modernas.",
      status: "Publicada",
      vacancies: 2,
      benefits: "Mentoría personalizada, certificado al finalizar, posibilidad de contratación",
    },
    {
      id: "2",
      title: "Analista de Marketing Digital",
      company: {
        id: "c2",
        name: "Marketing Pro",
        logoUrl: "/marketing-company-logo.jpg",
        isEmpresa: true,
        ownerUserId: "2",
      },
      city: "Bogotá",
      country: "Colombia",
      modality: "Híbrido",
      durationMonths: 4,
      postedAgo: "Hace 5 días",
      skills: ["Social Media", "Analytics", "Creatividad", "Comunicación"],
      description:
        "Únete a nuestro equipo de marketing y aprende sobre estrategias digitales, análisis de métricas y gestión de redes sociales.",
      status: "Publicada",
      vacancies: 3,
      benefits: "Horario flexible, trabajo híbrido, capacitación continua",
    },
    {
      id: "3",
      title: "Desarrollador Full Stack",
      company: {
        id: "c3",
        name: "InnovateLab",
        logoUrl: "/innovation-lab-logo.jpg",
        isEmpresa: true,
        ownerUserId: "2",
      },
      city: "Barcelona",
      country: "España",
      modality: "Presencial",
      durationMonths: 6,
      postedAgo: "Hace 1 semana",
      skills: ["React", "Node.js", "JavaScript", "Git"],
      description:
        "Práctica profesional en desarrollo full stack. Trabajarás con tecnologías modernas en un ambiente colaborativo.",
      status: "Publicada",
      vacancies: 1,
      benefits: "Compensación económica, ambiente joven, proyectos innovadores",
    },
    {
      id: "4",
      title: "Diseñador UX/UI Junior",
      company: {
        id: "c4",
        name: "DesignHub",
        logoUrl: "/design-company-logo.jpg",
        isEmpresa: true,
        ownerUserId: "2",
      },
      city: "Ciudad de México",
      country: "México",
      modality: "Remoto",
      durationMonths: 3,
      postedAgo: "Hace 3 días",
      skills: ["Diseño", "Creatividad", "Comunicación"],
      description:
        "Buscamos diseñador junior para crear experiencias de usuario excepcionales. Aprenderás sobre investigación UX y diseño de interfaces.",
      status: "Publicada",
      vacancies: 2,
      benefits: "Portafolio real, mentoría, herramientas profesionales",
    },
    {
      id: "5",
      title: "Desarrollador Python Backend",
      company: {
        id: "c5",
        name: "DataTech",
        logoUrl: "/data-tech-logo.jpg",
        isEmpresa: true,
        ownerUserId: "2",
      },
      city: "Bogotá",
      country: "Colombia",
      modality: "Híbrido",
      durationMonths: 6,
      postedAgo: "Hace 4 días",
      skills: ["Python", "Git", "JavaScript"],
      description:
        "Práctica en desarrollo backend con Python. Trabajarás en APIs y sistemas de procesamiento de datos.",
      status: "Publicada",
      vacancies: 1,
      benefits: "Aprendizaje continuo, proyectos desafiantes, equipo experimentado",
    },
    {
      id: "6",
      title: "Community Manager",
      company: {
        id: "c6",
        name: "SocialBrand",
        logoUrl: "/social-media-brand-logo.jpg",
        isEmpresa: true,
        ownerUserId: "2",
      },
      city: "Barcelona",
      country: "España",
      modality: "Remoto",
      durationMonths: 4,
      postedAgo: "Hace 6 días",
      skills: ["Social Media", "Marketing", "Creatividad", "Comunicación"],
      description:
        "Gestiona redes sociales de marcas reconocidas. Aprende sobre estrategia de contenido y engagement.",
      status: "Publicada",
      vacancies: 2,
      benefits: "Trabajo remoto, horario flexible, experiencia internacional",
    },
  ],
  applications: [
    {
      id: "app1",
      practiceId: "1", // Desarrollador Frontend React
      userId: "1", // Ana García (estudiante)
      status: "Enviada",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    },
    {
      id: "app2", 
      practiceId: "2", // Analista de Marketing Digital
      userId: "1", // Ana García (estudiante)
      status: "Revisando",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
    },
    {
      id: "app3",
      practiceId: "1", // Desarrollador Frontend React 
      userId: "3", // Carlos Mendoza (estudiante)
      status: "Aceptada",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
    },
    {
      id: "app4",
      practiceId: "4", // Diseñador UX/UI Junior
      userId: "1", // Ana García (estudiante)  
      status: "Enviada",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Hace 3 horas
    },
  ],
  threads: [],
  messages: [],
}

// In-memory data - will be loaded from JSONBin on initialization
let mockData: MockData = { ...defaultData }
let isInitialized = false

// Initialize data from JSONBin
const initializeWithJSONBin = async () => {
  if (typeof window === "undefined" || isInitialized) return

  try {
    console.log('[TalentBridge] Initializing data from JSONBin...')
    const initializedData = await vercelJsonBinService.initializeData()
    
    if (initializedData) {
      mockData = initializedData
      isInitialized = true
      console.log('[TalentBridge] ✅ Data loaded from JSONBin successfully')
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('talentbridge-data-initialized'))
    } else {
      // Use default data if JSONBin is empty
      mockData = { ...defaultData }
      isInitialized = true
      console.log('[TalentBridge] ⚠️ Using default data (JSONBin empty or unavailable)')
    }
  } catch (error) {
    console.error('[TalentBridge] ❌ Error initializing from JSONBin:', error)
    mockData = { ...defaultData }
    isInitialized = true
  }
}

// Auto-initialize on client side
if (typeof window !== "undefined") {
  initializeWithJSONBin()
}

// Save data to JSONBin
const saveData = async () => {
  if (typeof window === "undefined") return

  try {
    console.log('[mockApi] Saving data to JSONBin...')
    const success = await vercelJsonBinService.saveData(mockData)
    
    if (success) {
      console.log('[mockApi] ✅ Data saved to JSONBin')
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
    } else {
      console.warn('[mockApi] ⚠️ Failed to save to JSONBin')
    }
  } catch (error) {
    console.error('[mockApi] ❌ Error saving to JSONBin:', error)
  }
}

// Simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // Reload data from JSONBin
  async reloadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        await initializeWithJSONBin()
        console.log('[mockApi] Data reloaded from JSONBin')
        return true
      } catch (error) {
        console.error('[mockApi] Error reloading from JSONBin:', error)
        return false
      }
    }
    return false
  },
  
  // Reset to default data and save to JSONBin
  async repairStorage() {
    try {
      mockData = { ...defaultData }
      await saveData()
      console.log('[mockApi] Storage repaired and reset to defaults')
      
      // Emitir evento para actualizar todas las vistas
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
      }
    } catch (error) {
      console.error('[mockApi] Error repairing storage:', error)
    }
  },
  async login(email: string, password: string) {
    await delay()
    const user = mockData.users.find((u) => u.email === email)
    if (!user || password !== "123456") {
      throw new Error("Credenciales inválidas")
    }
    return { user, token: `token_${user.id}` }
  },

  async register(name: string, email: string, _password: string, role: Role, phone?: string) {
    await delay()
    if (mockData.users.find((u) => u.email === email)) {
      throw new Error("El correo ya está registrado")
    }
    
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      phone,
      avatarUrl: `/placeholder.svg?height=100&width=100&query=${role}`,
    }
    
    mockData.users.push(user)
    await saveData()
    
    console.log('[mockApi] New user registered:', user.name)
    return { user, token: `token_${user.id}` }
  },

  logout() {
    // No need to do anything for mock
  },

  async listPractices(filters?: {
    search?: string
    location?: string
    modality?: Modality
    duration?: number
    skills?: Skill[]
  }) {
    await delay(300)
    let practices = mockData.practices.filter((p) => p.status === "Publicada")

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      practices = practices.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.company.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.skills.some((s) => s.toLowerCase().includes(search)),
      )
    }

    if (filters?.location) {
      const location = filters.location.toLowerCase()
      practices = practices.filter(
        (p) => p.city.toLowerCase().includes(location) || p.country.toLowerCase().includes(location),
      )
    }

    if (filters?.modality) {
      practices = practices.filter((p) => p.modality === filters.modality)
    }

    if (filters?.duration) {
      practices = practices.filter((p) => p.durationMonths === filters.duration)
    }

    if (filters?.skills && filters.skills.length > 0) {
      practices = practices.filter((p) => filters.skills!.some((s) => p.skills.includes(s)))
    }

    return practices
  },

  async getPractice(id: string) {
    await delay(300)
    const practice = mockData.practices.find((p) => p.id === id)
    if (!practice) throw new Error("Práctica no encontrada")
    return practice
  },

  async createPractice(practice: Omit<Practice, "id" | "postedAgo">) {
    await delay()
    const newPractice: Practice = {
      ...practice,
      id: `practice_${Date.now()}`,
      postedAgo: "Hace unos momentos",
    }
    mockData.practices.push(newPractice)
    await saveData()
    console.log('[mockApi] New practice created:', newPractice.title)
    return newPractice
  },

  async updatePractice(practiceId: string, updates: Partial<Omit<Practice, "id" | "postedAgo">>) {
    await delay()
    const index = mockData.practices.findIndex((p) => p.id === practiceId)
    if (index === -1) {
      throw new Error("Práctica no encontrada")
    }
    
    mockData.practices[index] = {
      ...mockData.practices[index],
      ...updates,
    }
    
    await saveData()
    console.log('[mockApi] Practice updated:', practiceId)
    
    // Emitir evento para actualizar vistas
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
    }
    
    return mockData.practices[index]
  },

  async applyToPractice(practiceId: string, userId: string) {
    await delay()
    const existing = mockData.applications.find((a) => a.practiceId === practiceId && a.userId === userId)
    if (existing) {
      throw new Error("Ya has aplicado a esta práctica")
    }
    const application: Application = {
      id: `app_${Date.now()}`,
      practiceId,
      userId,
      status: "Enviada",
      createdAt: new Date().toISOString(),
    }
    mockData.applications.push(application)
    await saveData()
    console.log('[mockApi] New application created:', application.id)
    
    // Emitir evento para actualizar contadores
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('application-created', {
        detail: { applicationId: application.id, practiceId, userId, application }
      }))
    }
    
    return application
  },

  async listApplications(userId: string | "all" = "all") {
    await delay(300)
    if (userId === "all") {
      return mockData.applications
    }
    return mockData.applications.filter((a) => a.userId === userId)
  },

  async listUsers() {
    await delay(300)
    return mockData.users
  },

  async listThreads() {
    await delay(300)
    return mockData.threads
  },

  async getThread(id: string) {
    await delay(300)
    const thread = mockData.threads.find((t) => t.id === id)
    if (!thread) throw new Error("Conversación no encontrada")
    return thread
  },

  async listMessages(threadId: string) {
    await delay(300)
    return mockData.messages.filter((m) => m.threadId === threadId)
  },

  async sendMessage(threadId: string, fromUserId: string, text: string) {
    await delay()
    const message: Message = {
      id: `msg_${Date.now()}`,
      threadId,
      fromUserId,
      text,
      createdAt: new Date().toISOString(),
    }
    mockData.messages.push(message)
    
    // Update thread's last snippet
    const thread = mockData.threads.find((t) => t.id === threadId)
    if (thread) {
      thread.lastSnippet = text.length > 50 ? text.substring(0, 50) + "..." : text
      thread.unread = false
    }
    
    await saveData()
    console.log('[mockApi] Message sent in thread:', threadId)
    
    // Emitir evento para actualizar mensajes
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('message-sent', {
        detail: { messageId: message.id, threadId, fromUserId, message }
      }))
    }
    
    return message
  },

  async createThreadForApplication(practiceId: string, userId: string) {
    await delay()
    
    // Check if thread already exists
    const existingThread = mockData.threads.find((t) => t.practiceId === practiceId && t.userId === userId)
    if (existingThread) {
      return existingThread
    }
    
    // Get practice info and user info
    const practice = mockData.practices.find((p) => p.id === practiceId)
    if (!practice) throw new Error("Práctica no encontrada")
    
    const student = mockData.users.find((u) => u.id === userId)
    if (!student) throw new Error("Usuario no encontrado")
    
    // Create new thread with student name as partner (for company view)
    const thread: Thread = {
      id: `t_${Date.now()}`,
      practiceId,
      userId,
      partnerName: student.name, // Changed to show student name
      partnerIsEmpresa: false, // Changed to false since partner is student
      lastSnippet: "Inicia una conversación...",
      unread: false,
    }
    
    mockData.threads.push(thread)
    
    // Create welcome message from company
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}_welcome`,
      threadId: thread.id,
      fromUserId: practice.company.ownerUserId,
      text: `¡Hola! Gracias por tu interés en la posición de ${practice.title}. ¿En qué podemos ayudarte?`,
      createdAt: new Date().toISOString(),
    }
    
    mockData.messages.push(welcomeMessage)
    thread.lastSnippet = welcomeMessage.text.length > 50 ? welcomeMessage.text.substring(0, 50) + "..." : welcomeMessage.text
    
    await saveData()
    console.log('[mockApi] Thread created for application:', thread.id)
    
    // Emitir evento para actualizar threads
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('thread-created', {
        detail: { threadId: thread.id, practiceId, userId, thread }
      }))
    }
    
    return thread
  },

  // Nueva función: Crear thread directo entre dos usuarios (sin necesidad de aplicación)
  async createDirectThread(fromUserId: string, toUserId: string) {
    await delay()
    
    // Check if thread already exists between these users
    const existingThread = mockData.threads.find(
      (t) => 
        (t.userId === fromUserId && t.partnerId === toUserId) ||
        (t.userId === toUserId && t.partnerId === fromUserId)
    )
    if (existingThread) {
      return existingThread
    }
    
    // Get user info
    const fromUser = mockData.users.find((u) => u.id === fromUserId)
    const toUser = mockData.users.find((u) => u.id === toUserId)
    
    if (!fromUser || !toUser) throw new Error("Usuario no encontrado")
    
    // Determine thread type based on roles
    let threadType: 'admin-empresa' | 'admin-estudiante' | 'empresa-estudiante' = 'empresa-estudiante'
    if (fromUser.role === 'admin' && toUser.role === 'empresa') threadType = 'admin-empresa'
    else if (fromUser.role === 'empresa' && toUser.role === 'admin') threadType = 'admin-empresa'
    else if (fromUser.role === 'admin' && toUser.role === 'estudiante') threadType = 'admin-estudiante'
    else if (fromUser.role === 'estudiante' && toUser.role === 'admin') threadType = 'admin-estudiante'
    
    // Create new direct thread
    const thread: Thread = {
      id: `t_${Date.now()}`,
      userId: fromUserId,
      partnerId: toUserId,
      partnerName: toUser.name,
      partnerIsEmpresa: toUser.role === 'empresa',
      threadType,
      lastSnippet: "Inicia una conversación...",
      unread: false,
    }
    
    mockData.threads.push(thread)
    await saveData()
    console.log('[mockApi] Direct thread created:', thread.id, 'Type:', threadType)
    
    // Emitir evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('thread-created', {
        detail: { threadId: thread.id, thread }
      }))
    }
    
    return thread
  },
  // Simple counters for dashboard/home
  async countPractices() {
    await delay(150)
    return mockData.practices.filter((p) => p.status === "Publicada").length
  },
  async countApplications() {
    await delay(150)
    return mockData.applications.length
  },
  async countCompanies() {
    await delay(150)
    return mockData.users.filter((u) => u.role === "empresa").length
  },

  // Actualizar estado de aplicación (para empresas)
  async updateApplicationStatus(applicationId: string, newStatus: ApplicationStatus, reviewerUserId: string) {
    await delay(300)
    
    const application = mockData.applications.find(app => app.id === applicationId)
    if (!application) {
      throw new Error("Aplicación no encontrada")
    }

    // Verificar que el reviewer es el dueño de la práctica o admin
    const practice = mockData.practices.find(p => p.id === application.practiceId)
    if (!practice) {
      throw new Error("Práctica no encontrada")
    }

    const reviewer = mockData.users.find(u => u.id === reviewerUserId)
    if (!reviewer) {
      throw new Error("Usuario revisor no encontrado")
    }

    // Solo el dueño de la práctica o admin puede actualizar
    if (reviewer.role !== "admin" && practice.company.ownerUserId !== reviewerUserId) {
      throw new Error("No tienes permisos para actualizar esta aplicación")
    }

    // Actualizar el estado
    application.status = newStatus
    
    await saveData()
    console.log(`[mockApi] Application ${applicationId} status updated to ${newStatus} by ${reviewer.name}`)
    
    return application
  },

  // Eliminar práctica (solo admin o dueño)
  async deletePractice(practiceId: string) {
    await delay(300)
    
    const index = mockData.practices.findIndex(p => p.id === practiceId)
    if (index === -1) {
      throw new Error("Práctica no encontrada")
    }

    // Eliminar la práctica
    mockData.practices.splice(index, 1)
    
    // Eliminar aplicaciones relacionadas
    mockData.applications = mockData.applications.filter(app => app.practiceId !== practiceId)
    
    // Eliminar threads relacionados
    const threadIds = mockData.threads.filter(t => t.practiceId === practiceId).map(t => t.id)
    mockData.threads = mockData.threads.filter(t => t.practiceId !== practiceId)
    
    // Eliminar mensajes de esos threads
    mockData.messages = mockData.messages.filter(msg => !threadIds.includes(msg.threadId))
    
    await saveData()
    console.log(`[mockApi] Practice ${practiceId} and related data deleted`)
    
    // Emitir evento para actualizar prácticas
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('practice-deleted', {
        detail: { practiceId }
      }))
    }
  },

  // Eliminar usuario (solo admin)
  async deleteUser(userId: string) {
    await delay(300)
    
    const index = mockData.users.findIndex(u => u.id === userId)
    if (index === -1) {
      throw new Error("Usuario no encontrado")
    }

    const deletedUser = mockData.users[index]

    // Eliminar el usuario
    mockData.users.splice(index, 1)
    
    // Eliminar aplicaciones del usuario
    mockData.applications = mockData.applications.filter(app => app.userId !== userId)
    
    // Eliminar threads del usuario
    const threadIds = mockData.threads.filter(t => t.userId === userId).map(t => t.id)
    mockData.threads = mockData.threads.filter(t => t.userId !== userId)
    
    // Eliminar mensajes de esos threads
    mockData.messages = mockData.messages.filter(msg => !threadIds.includes(msg.threadId))
    
    // Eliminar prácticas si es empresa
    const practiceIds = mockData.practices.filter(p => p.company.ownerUserId === userId).map(p => p.id)
    mockData.practices = mockData.practices.filter(p => p.company.ownerUserId !== userId)
    
    // Eliminar aplicaciones de esas prácticas
    practiceIds.forEach(practiceId => {
      mockData.applications = mockData.applications.filter(app => app.practiceId !== practiceId)
    })
    
    await saveData()
    console.log(`[mockApi] User ${userId} (${deletedUser.name}) and related data deleted`)
    
    // Emitir evento específico para eliminación de usuario
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('user-deleted', { detail: { userId, user: deletedUser } }))
    }
  },

  // Cambiar rol de usuario (solo admin)
  async updateUserRole(userId: string, newRole: Role) {
    await delay(300)
    
    const user = mockData.users.find(u => u.id === userId)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    const oldRole = user.role
    user.role = newRole
    
    await saveData()
    console.log(`[mockApi] User ${userId} (${user.name}) role updated from ${oldRole} to ${newRole}`)
    
    // Emitir evento específico para cambio de rol
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('user-role-changed', { 
        detail: { userId, user, oldRole, newRole } 
      }))
    }
    
    return user
  },
  
  // Aceptar postulación (empresa o admin)
  async acceptApplication(applicationId: string) {
    await delay(300)
    
    const application = mockData.applications.find(a => a.id === applicationId)
    if (!application) {
      throw new Error("Postulación no encontrada")
    }
    
    application.status = "Aceptada"
    
    await saveData()
    console.log(`[mockApi] Application ${applicationId} accepted`)
    
    // Emitir evento específico
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('application-status-changed', {
        detail: { applicationId, newStatus: "Aceptada", application }
      }))
    }
    
    return application
  },
  
  // Rechazar postulación (empresa o admin)
  async rejectApplication(applicationId: string) {
    await delay(300)
    
    const application = mockData.applications.find(a => a.id === applicationId)
    if (!application) {
      throw new Error("Postulación no encontrada")
    }
    
    application.status = "Rechazada"
    
    await saveData()
    console.log(`[mockApi] Application ${applicationId} rejected`)
    
    // Emitir evento específico
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('application-status-changed', {
        detail: { applicationId, newStatus: "Rechazada", application }
      }))
    }
    
    return application
  },
  
  // Cambiar estado de postulación a "Revisando"
  async reviewApplication(applicationId: string) {
    await delay(300)
    
    const application = mockData.applications.find(a => a.id === applicationId)
    if (!application) {
      throw new Error("Postulación no encontrada")
    }
    
    application.status = "Revisando"
    
    await saveData()
    console.log(`[mockApi] Application ${applicationId} marked as reviewing`)
    
    // Emitir evento específico
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('application-status-changed', {
        detail: { applicationId, newStatus: "Revisando", application }
      }))
    }
    
    return application
  },
  
  // Migrar ofertas del ownerUserId antiguo al nuevo
  async migratePracticesToUser(oldOwnerId: string, newOwnerId: string) {
    await delay(100)
    
    let migratedCount = 0
    mockData.practices.forEach(practice => {
      if (practice.company.ownerUserId === oldOwnerId) {
        practice.company.ownerUserId = newOwnerId
        migratedCount++
      }
    })
    
    if (migratedCount > 0) {
      await saveData()
      console.log(`[mockApi] Migrated ${migratedCount} practices from ${oldOwnerId} to ${newOwnerId}`)
      
      // Emitir evento para actualizar prácticas
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('practices-migrated', {
          detail: { oldOwnerId, newOwnerId, count: migratedCount }
        }))
      }
    }
    
    return migratedCount
  },

  // Eliminar postulación (solo permitido si NO está aceptada)
  async deleteApplication(applicationId: string) {
    await delay(300)
    
    const application = mockData.applications.find(a => a.id === applicationId)
    if (!application) {
      throw new Error("Postulación no encontrada")
    }
    
    // No permitir eliminar postulaciones aceptadas
    if (application.status === "Aceptada") {
      throw new Error("No se pueden eliminar postulaciones aceptadas")
    }
    
    // Eliminar la postulación
    mockData.applications = mockData.applications.filter(a => a.id !== applicationId)
    
    await saveData()
    console.log(`[mockApi] Application ${applicationId} deleted`)
    
    // Emitir evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('application-deleted', {
        detail: { applicationId }
      }))
    }
    
    return true
  },

  // Limpiar todos los threads y mensajes
  async clearAllThreadsAndMessages() {
    await delay(300)
    
    mockData.threads = []
    mockData.messages = []
    
    await saveData()
    console.log('[mockApi] All threads and messages cleared')
    
    // Emitir evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
    }
    
    return true
  },

  // Eliminar un thread específico y sus mensajes
  async deleteThread(threadId: string) {
    await delay(300)
    
    // Eliminar el thread
    const threadIndex = mockData.threads.findIndex(t => t.id === threadId)
    if (threadIndex === -1) {
      throw new Error("Thread no encontrado")
    }
    
    mockData.threads.splice(threadIndex, 1)
    
    // Eliminar todos los mensajes de ese thread
    mockData.messages = mockData.messages.filter(m => m.threadId !== threadId)
    
    await saveData()
    console.log('[mockApi] Thread deleted:', threadId)
    
    // Emitir evento
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('talentbridge-data-updated'))
    }
    
    return true
  },
}
