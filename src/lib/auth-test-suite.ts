export class AuthTestSuite {
  private static instance: AuthTestSuite;
  
  static getInstance(): AuthTestSuite {
    if (!this.instance) {
      this.instance = new AuthTestSuite();
    }
    return this.instance;
  }

  private log(message: string) {
    console.log(`[AuthTest] ${message}`);
    // Also dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('auth-test-log', { 
      detail: { message, timestamp: new Date() } 
    }));
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runComprehensiveAuthTest(): Promise<{ success: boolean; report: string[] }> {
    const report: string[] = [];
    let success = true;

    try {
      this.log("🚀 Iniciando test integral de autenticación");
      report.push("=== TEST INTEGRAL DE AUTENTICACIÓN ===");

      // Test 1: Limpiar estado inicial
      this.log("📋 Test 1: Limpiando estado inicial");
      localStorage.clear();
      await this.delay(100);
      
      const { useAuthStore } = await import('../stores/auth-store');
      useAuthStore.getState().logout();
      await this.delay(100);

      const initialUser = useAuthStore.getState().user;
      if (initialUser === null) {
        this.log("✅ Estado inicial limpio");
        report.push("✅ Test 1: Estado inicial limpio");
      } else {
        this.log("❌ Estado inicial no está limpio");
        report.push("❌ Test 1: Estado inicial contaminado");
        success = false;
      }

      // Test 2: Login directo con API
      this.log("📋 Test 2: Login directo con API");
      const { mockApi } = await import('../mocks/api');
      
      try {
        const apiResult = await mockApi.login("empresa@demo.com", "123456");
        this.log(`✅ API login exitoso: ${apiResult.user.name}`);
        report.push(`✅ Test 2: API login exitoso - ${apiResult.user.name} (${apiResult.user.role})`);
      } catch (error: any) {
        this.log(`❌ API login falló: ${error.message}`);
        report.push(`❌ Test 2: API login falló - ${error.message}`);
        success = false;
      }

      // Test 3: Login con Store
      this.log("📋 Test 3: Login con Zustand Store");
      try {
        await useAuthStore.getState().login("empresa@demo.com", "123456");
        await this.delay(200); // Esperar hidratación
        
        const storeUser = useAuthStore.getState().user;
        if (storeUser && storeUser.email === "empresa@demo.com") {
          this.log(`✅ Store login exitoso: ${storeUser.name}`);
          report.push(`✅ Test 3: Store login exitoso - ${storeUser.name} (${storeUser.role})`);
        } else {
          this.log("❌ Store login no persistió el usuario");
          report.push("❌ Test 3: Store login no persistió el usuario");
          success = false;
        }
      } catch (error: any) {
        this.log(`❌ Store login falló: ${error.message}`);
        report.push(`❌ Test 3: Store login falló - ${error.message}`);
        success = false;
      }

      // Test 4: Persistencia en localStorage
      this.log("📋 Test 4: Verificando persistencia en localStorage");
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.state && parsed.state.user && parsed.state.user.email === "empresa@demo.com") {
            this.log("✅ Datos persistidos correctamente en localStorage");
            report.push("✅ Test 4: Persistencia en localStorage correcta");
          } else {
            this.log("❌ Datos en localStorage no coinciden");
            report.push("❌ Test 4: Datos en localStorage no coinciden");
            success = false;
          }
        } catch (error) {
          this.log("❌ Error al parsear datos de localStorage");
          report.push("❌ Test 4: Error al parsear localStorage");
          success = false;
        }
      } else {
        this.log("❌ No hay datos en localStorage");
        report.push("❌ Test 4: No hay datos en localStorage");
        success = false;
      }

      // Test 5: Simulación de recarga de página
      this.log("📋 Test 5: Simulando recarga de página");
      
      // Crear nueva instancia del store para simular recarga
      const { create } = await import('zustand');
      const { persist, createJSONStorage } = await import('zustand/middleware');
      
      const testStore = create(
        persist(
          (set: any) => ({
            user: null,
            token: null,
            login: async (email: string, password: string) => {
              const result = await mockApi.login(email, password);
              set({ user: result.user, token: result.token });
            },
            logout: () => set({ user: null, token: null }),
          }),
          {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
          }
        )
      );

      await this.delay(300); // Esperar hidratación
      
      const rehydratedUser = testStore.getState().user as any;
      if (rehydratedUser && rehydratedUser.email === "empresa@demo.com") {
        this.log("✅ Rehidratación después de 'recarga' exitosa");
        report.push("✅ Test 5: Rehidratación exitosa");
      } else {
        this.log("❌ Rehidratación falló");
        report.push("❌ Test 5: Rehidratación falló");
        success = false;
      }

      // Test 6: Navegación a página protegida
      this.log("📋 Test 6: Test de navegación a página protegida");
      
      // Verificar estado actual antes de navegar
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.role === "empresa") {
        this.log("✅ Usuario empresa autenticado, debería poder acceder a company-applications");
        report.push("✅ Test 6: Usuario autenticado para acceso a páginas protegidas");
        
        // Simular navegación (sin hacer la navegación real para no interrumpir el test)
        this.log("ℹ️ Navegación a /company-applications debería ser exitosa");
        report.push("ℹ️ Navegación a /company-applications lista");
      } else {
        this.log("❌ Usuario no está autenticado para páginas protegidas");
        report.push("❌ Test 6: Usuario no autenticado para páginas protegidas");
        success = false;
      }

      // Resumen final
      this.log(`🏁 Test completado - Éxito: ${success ? 'SÍ' : 'NO'}`);
      report.push("=== RESUMEN ===");
      report.push(success ? "🎉 TODOS LOS TESTS PASARON" : "❌ ALGUNOS TESTS FALLARON");
      
      return { success, report };

    } catch (error: any) {
      this.log(`💥 Error crítico en test: ${error.message}`);
      report.push(`💥 Error crítico: ${error.message}`);
      return { success: false, report };
    }
  }

  async runQuickLoginTest(email: string = "empresa@demo.com"): Promise<boolean> {
    try {
      this.log(`🔄 Test rápido de login para ${email}`);
      
      const { useAuthStore } = await import('../stores/auth-store');
      await useAuthStore.getState().login(email, "123456");
      await this.delay(100);
      
      const user = useAuthStore.getState().user;
      const success = !!(user && user.email === email);
      
      this.log(success ? "✅ Login rápido exitoso" : "❌ Login rápido falló");
      return success;
    } catch (error: any) {
      this.log(`❌ Error en login rápido: ${error.message}`);
      return false;
    }
  }

  async testCompanyApplicationsAccess(): Promise<boolean> {
    try {
      this.log("🔍 Testeando acceso a company-applications");
      
      // Verificar autenticación
      const { useAuthStore } = await import('../stores/auth-store');
      const user = useAuthStore.getState().user;
      
      if (!user) {
        this.log("❌ Usuario no autenticado");
        return false;
      }

      if (user.role !== "empresa" && user.role !== "admin") {
        this.log("❌ Usuario no tiene rol adecuado");
        return false;
      }

      this.log(`✅ Usuario ${user.name} (${user.role}) puede acceder a company-applications`);
      return true;
    } catch (error: any) {
      this.log(`❌ Error al verificar acceso: ${error.message}`);
      return false;
    }
  }
}