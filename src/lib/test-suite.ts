import { mockApi } from '../mocks/api'
import type { Application } from '../types'

interface TestResult {
  step: string
  status: 'success' | 'error'
  message: string
  data?: any
}

export class ApplicationTestSuite {
  private results: TestResult[] = []

  private log(step: string, status: 'success' | 'error', message: string, data?: any) {
    const result = { step, status, message, data }
    this.results.push(result)
    console.log(`[TEST] ${step}: ${status.toUpperCase()} - ${message}`, data || '')
    return result
  }

  async runCompleteTest(): Promise<TestResult[]> {
    this.results = []
    console.log('🧪 INICIANDO PRUEBA COMPLETA DEL SISTEMA DE ACCEPT/REJECT')
    console.log('=' .repeat(60))

    try {
      // Paso 1: Ver aplicaciones iniciales del estudiante Ana García
      await this.testStudentViewApplications()
      
      // Paso 2: Buscar aplicaciones para la empresa
      await this.testCompanyViewApplications()
      
      // Paso 3: Aceptar una aplicación
      await this.testAcceptApplication()
      
      // Paso 4: Rechazar una aplicación
      await this.testRejectApplication()
      
      // Paso 5: Verificar cambios como estudiante
      await this.testStudentVerifyChanges()
      
      // Resumen final
      this.showTestSummary()
      
    } catch (error) {
      this.log('GLOBAL_ERROR', 'error', `Error inesperado: ${error}`)
    }

    return this.results
  }

  private async testStudentViewApplications() {
    try {
      const applications = await mockApi.listApplications('1') // Ana García
      const initialStates = applications.map(app => ({
        id: app.id,
        practiceId: app.practiceId,
        status: app.status,
        createdAt: app.createdAt
      }))
      
      this.log('STUDENT_VIEW_INITIAL', 'success', `Estudiante Ana García tiene ${applications.length} aplicaciones`, initialStates)
      
      // Guardar estados iniciales para comparar después
      ;(window as any).initialApplicationStates = initialStates
      
    } catch (error) {
      this.log('STUDENT_VIEW_INITIAL', 'error', `Error viendo aplicaciones: ${error}`)
      throw error
    }
  }

  private async testCompanyViewApplications() {
    try {
      // Obtener todas las aplicaciones y filtrar por las prácticas de la empresa (userId "2")
      const allApplications = await mockApi.listApplications('all')
      const allPractices = await mockApi.listPractices()
      
      // Filtrar aplicaciones de prácticas que pertenecen a la empresa (ownerUserId: "2")
      const companyApplications = allApplications.filter(app => {
        const practice = allPractices.find(p => p.id === app.practiceId)
        return practice?.company.ownerUserId === '2'
      })
      
      this.log('COMPANY_VIEW_APPLICATIONS', 'success', `Empresa TechCorp tiene ${companyApplications.length} aplicaciones para revisar`, companyApplications.map(app => ({ id: app.id, status: app.status })))
      
      // Guardar para usar en otros tests
      ;(window as any).companyApplications = companyApplications
      
    } catch (error) {
      this.log('COMPANY_VIEW_APPLICATIONS', 'error', `Error viendo aplicaciones de empresa: ${error}`)
      throw error
    }
  }

  private async testAcceptApplication() {
    try {
      const companyApplications = (window as any).companyApplications || []
      const pendingApp = companyApplications.find((app: Application) => app.status === 'Enviada')
      
      if (!pendingApp) {
        this.log('ACCEPT_APPLICATION', 'error', 'No se encontró aplicación pendiente para aceptar')
        return
      }

      const beforeStatus = pendingApp.status
      await mockApi.updateApplicationStatus(pendingApp.id, 'Aceptada', '2')
      
      // Verificar cambio
      const allApps = await mockApi.listApplications('all')
      const updatedApp = allApps.find(app => app.id === pendingApp.id)
      
      if (updatedApp?.status === 'Aceptada') {
        this.log('ACCEPT_APPLICATION', 'success', `Aplicación ${pendingApp.id} aceptada correctamente`, {
          applicationId: pendingApp.id,
          beforeStatus,
          afterStatus: updatedApp.status,
          userId: pendingApp.userId
        })
      } else {
        this.log('ACCEPT_APPLICATION', 'error', 'La aplicación no se actualizó correctamente')
      }
      
    } catch (error) {
      this.log('ACCEPT_APPLICATION', 'error', `Error aceptando aplicación: ${error}`)
    }
  }

  private async testRejectApplication() {
    try {
      const companyApplications = (window as any).companyApplications || []
      const pendingApp = companyApplications.find((app: Application) => app.status === 'Revisando')
      
      if (!pendingApp) {
        this.log('REJECT_APPLICATION', 'error', 'No se encontró aplicación en revisión para rechazar')
        return
      }

      const beforeStatus = pendingApp.status
      await mockApi.updateApplicationStatus(pendingApp.id, 'Rechazada', '2')
      
      // Verificar cambio
      const allApps = await mockApi.listApplications('all')
      const updatedApp = allApps.find(app => app.id === pendingApp.id)
      
      if (updatedApp?.status === 'Rechazada') {
        this.log('REJECT_APPLICATION', 'success', `Aplicación ${pendingApp.id} rechazada correctamente`, {
          applicationId: pendingApp.id,
          beforeStatus,
          afterStatus: updatedApp.status,
          userId: pendingApp.userId
        })
      } else {
        this.log('REJECT_APPLICATION', 'error', 'La aplicación no se actualizó correctamente')
      }
      
    } catch (error) {
      this.log('REJECT_APPLICATION', 'error', `Error rechazando aplicación: ${error}`)
    }
  }

  private async testStudentVerifyChanges() {
    try {
      // Ver aplicaciones actualizadas del estudiante Ana García
      const finalApplications = await mockApi.listApplications('1')
      const finalStates = finalApplications.map(app => ({
        id: app.id,
        practiceId: app.practiceId,
        status: app.status,
        createdAt: app.createdAt
      }))
      
      // Comparar con estados iniciales
      const initialStates = (window as any).initialApplicationStates || []
      const changes = []
      
      for (const finalApp of finalStates) {
        const initialApp = initialStates.find((app: any) => app.id === finalApp.id)
        if (initialApp && initialApp.status !== finalApp.status) {
          changes.push({
            applicationId: finalApp.id,
            from: initialApp.status,
            to: finalApp.status
          })
        }
      }
      
      if (changes.length > 0) {
        this.log('STUDENT_VERIFY_CHANGES', 'success', `Estudiante ve ${changes.length} cambios en sus aplicaciones`, { changes, finalStates })
      } else {
        this.log('STUDENT_VERIFY_CHANGES', 'error', 'No se detectaron cambios en las aplicaciones del estudiante', { finalStates })
      }
      
    } catch (error) {
      this.log('STUDENT_VERIFY_CHANGES', 'error', `Error verificando cambios: ${error}`)
    }
  }

  private showTestSummary() {
    console.log('📊 RESUMEN DE PRUEBA')
    console.log('=' .repeat(60))
    
    const successCount = this.results.filter(r => r.status === 'success').length
    const errorCount = this.results.filter(r => r.status === 'error').length
    
    console.log(`✅ Pasos exitosos: ${successCount}`)
    console.log(`❌ Pasos con error: ${errorCount}`)
    console.log(`📈 Tasa de éxito: ${Math.round((successCount / this.results.length) * 100)}%`)
    
    if (errorCount > 0) {
      console.log('\n🚨 ERRORES ENCONTRADOS:')
      this.results.filter(r => r.status === 'error').forEach(result => {
        console.log(`  - ${result.step}: ${result.message}`)
      })
    }
    
    console.log('\n🎯 CONCLUSIÓN:', successCount >= 4 ? 
      '¡Sistema funcionando correctamente!' : 
      'Sistema tiene problemas que requieren atención')
  }

  // Método para prueba rápida desde consola del navegador
  static async quickTest() {
    console.log('🚀 EJECUTANDO PRUEBA RÁPIDA...')
    const tester = new ApplicationTestSuite()
    await tester.runCompleteTest()
    return tester.results
  }
}

// Exponer globalmente para uso en consola del navegador
if (typeof window !== 'undefined') {
  ;(window as any).ApplicationTestSuite = ApplicationTestSuite
}