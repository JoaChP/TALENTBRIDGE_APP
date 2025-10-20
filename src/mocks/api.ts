import type { User, Practice, Application, Thread, Message, Role, Skill, Modality } from "../types"

// Mock data storage
const STORAGE_KEY = "talentbridge_data"

interface MockData {
  users: User[]
  practices: Practice[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

// Default seed data used when no localStorage or when storage is missing sections
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
  applications: [],
  threads: [
    {
      id: "t1",
      practiceId: "1",
      partnerName: "TechCorp",
      partnerIsEmpresa: true,
      lastSnippet: "Gracias por tu interés en la posición...",
      unread: true,
    },
    {
      id: "t2",
      practiceId: "2",
      partnerName: "Marketing Pro",
      partnerIsEmpresa: true,
      lastSnippet: "Hemos revisado tu perfil y nos gustaría...",
      unread: false,
    },
    {
      id: "t3",
      partnerName: "Carlos Mendoza",
      partnerIsEmpresa: false,
      lastSnippet: "Hola, tengo una pregunta sobre...",
      unread: false,
    },
  ],
  messages: [
    {
      id: "m1",
      threadId: "t1",
      fromUserId: "2",
      text: "Gracias por tu interés en la posición de Desarrollador Frontend React.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "m2",
      threadId: "t1",
      fromUserId: "1",
      text: "Muchas gracias por la oportunidad. Estoy muy interesado en la posición.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

const getInitialData = (): MockData => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<MockData>

        // Ensure sections exist and fall back to seeds when missing or empty
        const users = parsed.users && parsed.users.length > 0 ? parsed.users : defaultData.users
        const practices = parsed.practices && parsed.practices.length > 0 ? parsed.practices : defaultData.practices

        // For array sections, treat empty arrays as 'missing' and fall back to defaults
        const applications = parsed.applications && parsed.applications.length > 0 ? parsed.applications : defaultData.applications
        const threads = parsed.threads && parsed.threads.length > 0 ? parsed.threads : defaultData.threads
        const messages = parsed.messages && parsed.messages.length > 0 ? parsed.messages : defaultData.messages

        const merged: MockData = { users, practices, applications, threads, messages }

        // Persist merged data if any section was filled from defaults (to repair broken storage)
        const shouldPersist =
          !parsed.users || !parsed.practices || !parsed.applications || !parsed.threads || !parsed.messages ||
          (parsed.users && parsed.users.length === 0) ||
          (parsed.practices && parsed.practices.length === 0) ||
          (parsed.applications && parsed.applications.length === 0) ||
          (parsed.threads && parsed.threads.length === 0) ||
          (parsed.messages && parsed.messages.length === 0)

        if (shouldPersist) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          } catch (e) {
            // ignore storage errors
          }
        }

        return merged
      } catch (e) {
        // If stored is corrupted, fall back to defaults and reset storage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
        } catch (err) {
          // ignore
        }
        return defaultData
      }
    }
  }

  return defaultData
}

const mockData = getInitialData()

const saveData = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
  }
}

// Simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // Repair storage by resetting to default seed data (useful when localStorage was corrupted)
  repairStorage() {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
      }
    } catch (e) {
      // ignore
    }
    // mutate in-memory mockData
    Object.assign(mockData, JSON.parse(JSON.stringify(defaultData)))
  },
  async login(email: string, password: string) {
    await delay()
    const user = mockData.users.find((u) => u.email === email)
    if (!user || password !== "123456") {
      throw new Error("Credenciales inválidas")
    }
    return { user, token: `token_${user.id}` }
  },

  async register(name: string, email: string, _password: string, role: Role) {
    await delay()
    if (mockData.users.find((u) => u.email === email)) {
      throw new Error("El correo ya está registrado")
    }
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `/placeholder.svg?height=100&width=100&query=${role}`,
    }
    mockData.users.push(user)
    saveData()
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
    saveData()
    return newPractice
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
    saveData()
    return application
  },

  async listApplications(userId: string) {
    await delay(300)
    return mockData.applications.filter((a) => a.userId === userId)
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
    saveData()
    return message
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
}
