// Configuración centralizada de JSONBin
// Credenciales configuradas para usar JSONBin como único sistema de almacenamiento

export const JSONBIN_CONFIG = {
  enabled: true, // Always enabled - JSONBin is the single source of truth
  binId: '68fdc914d0ea881f40bcac75',
  apiKey: '$2a$10$UarOMdF.8I8gzndns6lU/OZKukELebwucjJfAi0rz66NDhLKnzuNC',
} as const

// Validación de configuración
export function isJSONBinConfigured(): boolean {
  return JSONBIN_CONFIG.enabled && !!JSONBIN_CONFIG.binId && !!JSONBIN_CONFIG.apiKey
}

export function getJSONBinConfig() {
  if (!isJSONBinConfigured()) {
    console.error('[JSONBin Config] ❌ JSONBin not properly configured')
    throw new Error('JSONBin configuration is required')
  }
  
  console.log('[JSONBin Config] ✅ Using JSONBin as single source of truth')
  return JSONBIN_CONFIG
}
