export type Role = "estudiante" | "empresa" | "admin"
export type Modality = "Remoto" | "Híbrido" | "Presencial"
export type Skill =
  | "React"
  | "JavaScript"
  | "CSS"
  | "Git"
  | "Social Media"
  | "Analytics"
  | "Creatividad"
  | "Comunicación"
  | "Node.js"
  | "Python"
  | "Diseño"
  | "Marketing"
export type ApplicationStatus = "Enviada" | "Revisando" | "Aceptada" | "Rechazada"
export type PracticeStatus = "Borrador" | "Publicada"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  phone?: string
  about?: string
  avatarUrl?: string
}

export interface Company {
  id: string
  name: string
  logoUrl?: string
  isEmpresa: boolean
  ownerUserId: string
}

export interface Practice {
  id: string
  title: string
  company: Company
  city: string
  country: string
  modality: Modality
  durationMonths: 3 | 4 | 6
  postedAgo: string
  skills: Skill[]
  description: string
  status: PracticeStatus
  vacancies?: number
  benefits?: string
}

export interface Application {
  id: string
  practiceId: string
  userId: string
  status: ApplicationStatus
  createdAt: string
}

export interface Thread {
  id: string
  practiceId?: string
  partnerName: string
  partnerIsEmpresa: boolean
  lastSnippet: string
  unread?: boolean
}

export interface Message {
  id: string
  threadId: string
  fromUserId: string
  text: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: Role) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}
