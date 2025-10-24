import type { Practice, User } from "../types"

/**
 * Sistema de filtrado de ofertas para identificar y separar ofertas reales de ofertas quemadas/demo
 */

// Criterios para identificar ofertas quemadas/demo
const DEMO_INDICATORS = {
  // IDs que indican datos de demo (secuenciales simples)
  demoIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  
  // Empresas que son claramente de demo
  demoCompanies: [
    'TechCorp',
    'Marketing Pro', 
    'InnovateLab',
    'DesignHub',
    'DataTech',
    'SocialBrand',
    'Demo Company',
    'Test Corp',
    'Example Inc'
  ],
  
  // Emails de demo
  demoEmails: [
    'demo.com',
    'example.com',
    'test.com',
    'localhost'
  ],
  
  // Frases que indican contenido de demo
  demoPhrases: [
    'demo',
    'ejemplo',
    'test',
    'prueba',
    'práctica de ejemplo',
    'lorem ipsum',
    'placeholder'
  ],
  
  // Ubicaciones muy genéricas que podrían ser demo
  genericLocations: [
    'Ciudad de México',
    'Bogotá', 
    'Barcelona'
  ]
}

/**
 * Analiza una oferta para determinar si es real o de demo/quemada
 */
export const analyzePracticeValidity = (practice: Practice): {
  isReal: boolean
  score: number
  reasons: string[]
} => {
  let score = 100 // Empezamos asumiendo que es real
  const reasons: string[] = []
  
  // Verificar ID secuencial simple
  if (DEMO_INDICATORS.demoIds.includes(practice.id)) {
    score -= 30
    reasons.push('ID secuencial simple sugiere datos de demo')
  }
  
  // Verificar empresa de demo
  const companyName = practice.company?.name || ''
  if (DEMO_INDICATORS.demoCompanies.some(demo => 
    companyName.toLowerCase().includes(demo.toLowerCase())
  )) {
    score -= 40
    reasons.push(`Empresa "${companyName}" es identificada como demo`)
  }
  
  // Verificar emails de demo en la empresa
  if (practice.company?.ownerUserId) {
    // Esto requeriría acceso a los datos de usuarios, lo evaluaremos por separado
  }
  
  // Verificar contenido de demo en título y descripción
  const textContent = `${practice.title} ${practice.description}`.toLowerCase()
  DEMO_INDICATORS.demoPhrases.forEach(phrase => {
    if (textContent.includes(phrase.toLowerCase())) {
      score -= 15
      reasons.push(`Contiene palabra de demo: "${phrase}"`)
    }
  })
  
  // Verificar ubicaciones genéricas (peso menor)
  if (DEMO_INDICATORS.genericLocations.includes(practice.city)) {
    score -= 10
    reasons.push(`Ubicación muy genérica: ${practice.city}`)
  }
  
  // Verificar si tiene datos muy básicos (indicativo de demo)
  if (!practice.skills || practice.skills.length <= 2) {
    score -= 15
    reasons.push('Pocos skills especificados (puede ser demo)')
  }
  
  // Verificar fechas muy recientes (hace pocos días) + otros indicadores
  if (practice.postedAgo && practice.postedAgo.includes('día')) {
    score -= 5
    reasons.push('Publicado muy recientemente')
  }
  
  return {
    isReal: score >= 50, // 50+ se considera real
    score,
    reasons
  }
}

/**
 * Filtra una lista de ofertas separando reales de demo/quemadas
 */
export const filterPractices = (practices: Practice[]) => {
  const real: Practice[] = []
  const demo: Practice[] = []
  const analysis: Array<{
    practice: Practice
    validity: ReturnType<typeof analyzePracticeValidity>
  }> = []
  
  practices.forEach(practice => {
    const validity = analyzePracticeValidity(practice)
    analysis.push({ practice, validity })
    
    if (validity.isReal) {
      real.push(practice)
    } else {
      demo.push(practice)
    }
  })
  
  return {
    real,
    demo,
    analysis,
    summary: {
      total: practices.length,
      real: real.length,
      demo: demo.length,
      realPercentage: Math.round((real.length / practices.length) * 100)
    }
  }
}

/**
 * Analiza usuarios para identificar cuentas de demo
 */
export const analyzeUserValidity = (user: User): {
  isReal: boolean
  score: number
  reasons: string[]
} => {
  let score = 100
  const reasons: string[] = []
  
  // Verificar email de demo
  if (DEMO_INDICATORS.demoEmails.some(domain => 
    user.email.toLowerCase().includes(domain)
  )) {
    score -= 50
    reasons.push(`Email de demo: ${user.email}`)
  }
  
  // Verificar ID secuencial
  if (DEMO_INDICATORS.demoIds.includes(user.id)) {
    score -= 30
    reasons.push('ID secuencial simple')
  }
  
  // Verificar nombres muy genéricos
  const genericNames = ['admin', 'test', 'demo', 'ejemplo']
  if (genericNames.some(name => 
    user.name.toLowerCase().includes(name)
  )) {
    score -= 40
    reasons.push(`Nombre genérico: ${user.name}`)
  }
  
  return {
    isReal: score >= 50,
    score,
    reasons
  }
}

/**
 * Función principal para limpiar el sistema de datos demo
 */
export const cleanSystemData = (data: {
  practices: Practice[]
  users: User[]
  applications: any[]
  threads: any[]
  messages: any[]
}) => {
  // Filtrar ofertas
  const practiceFilter = filterPractices(data.practices)
  
  // Filtrar usuarios
  const realUsers: User[] = []
  const demoUsers: User[] = []
  
  data.users.forEach(user => {
    const validity = analyzeUserValidity(user)
    if (validity.isReal) {
      realUsers.push(user)
    } else {
      demoUsers.push(user)
    }
  })
  
  // IDs de ofertas y usuarios demo para limpiar relaciones
  const demoPracticeIds = practiceFilter.demo.map(p => p.id)
  const demoUserIds = demoUsers.map(u => u.id)
  
  // Filtrar aplicaciones relacionadas con ofertas/usuarios demo
  const realApplications = data.applications.filter(app => 
    !demoPracticeIds.includes(app.practiceId) && 
    !demoUserIds.includes(app.userId)
  )
  
  // Filtrar threads relacionados con ofertas/usuarios demo
  const realThreads = data.threads.filter(thread => 
    (!thread.practiceId || !demoPracticeIds.includes(thread.practiceId)) &&
    !demoUserIds.includes(thread.userId)
  )
  
  // Filtrar mensajes relacionados con threads demo
  const realThreadIds = realThreads.map(t => t.id)
  const realMessages = data.messages.filter(message => 
    realThreadIds.includes(message.threadId)
  )
  
  return {
    cleaned: {
      practices: practiceFilter.real,
      users: realUsers,
      applications: realApplications,
      threads: realThreads,
      messages: realMessages
    },
    removed: {
      practices: practiceFilter.demo,
      users: demoUsers,
      applications: data.applications.length - realApplications.length,
      threads: data.threads.length - realThreads.length,
      messages: data.messages.length - realMessages.length
    },
    analysis: {
      practices: practiceFilter.analysis,
      summary: {
        totalPractices: data.practices.length,
        realPractices: practiceFilter.real.length,
        demoPractices: practiceFilter.demo.length,
        totalUsers: data.users.length,
        realUsers: realUsers.length,
        demoUsers: demoUsers.length
      }
    }
  }
}