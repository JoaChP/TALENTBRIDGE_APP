// Configuración centralizada de JSONBin
// Este archivo contiene las credenciales hardcodeadas para desarrollo
// TODO: En producción, usar variables de entorno del hosting

export const JSONBIN_CONFIG = {
  enabled: true,
  binId: '68fdc914d0ea881f40bcac75',
  apiKey: '$2a$10$UarOMdF.8I8gzndns6lU/OZKukELebwucjJfAi0rz66NDhLKnzuNC',
} as const

// Validación de configuración
export function isJSONBinConfigured(): boolean {
  return JSONBIN_CONFIG.enabled && !!JSONBIN_CONFIG.binId && !!JSONBIN_CONFIG.apiKey
}

export function getJSONBinConfig() {
  if (!isJSONBinConfigured()) {
    console.warn('[JSONBin Config] JSONBin not properly configured')
    return {
      enabled: false,
      binId: '',
      apiKey: '',
    }
  }
  
  console.log('[JSONBin Config] Using hardcoded configuration for development')
  return JSONBIN_CONFIG
}
