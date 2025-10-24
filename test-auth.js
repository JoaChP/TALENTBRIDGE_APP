#!/usr/bin/env node

// Script para testear el flujo de autenticación de forma programática
const puppeteer = require('puppeteer');

async function runAuthTest() {
  console.log('🚀 Iniciando test automatizado de autenticación...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Para poder ver qué pasa
    devtools: true 
  });
  
  try {
    const page = await browser.newPage();
    
    // Configurar console logs
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`[BROWSER ${msg.type().toUpperCase()}]`, msg.text());
      }
    });

    console.log('📱 Navegando a la página de login...');
    await page.goto('http://localhost:3000/login');
    
    // Esperar a que la página cargue
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    
    console.log('✏️ Rellenando formulario de login...');
    await page.type('input[type="email"]', 'empresa@demo.com');
    await page.type('input[type="password"]', '123456');
    
    console.log('🔑 Haciendo clic en login...');
    await page.click('button[type="submit"]');
    
    // Esperar redirección o mensaje de error
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`📍 URL actual después del login: ${currentUrl}`);
    
    // Verificar si estamos autenticados
    const user = await page.evaluate(() => {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user;
      }
      return null;
    });
    
    if (user) {
      console.log(`✅ Usuario autenticado: ${user.name} (${user.email}) - Rol: ${user.role}`);
      
      // Intentar navegar a company-applications
      console.log('🏢 Navegando a company-applications...');
      await page.goto('http://localhost:3000/company-applications');
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log(`📍 URL final: ${finalUrl}`);
      
      if (finalUrl.includes('company-applications')) {
        console.log('🎉 ¡SUCCESS! Acceso a company-applications exitoso');
      } else if (finalUrl.includes('login')) {
        console.log('❌ FALLO: Redirigido al login');
      } else {
        console.log(`⚠️ URL inesperada: ${finalUrl}`);
      }
      
    } else {
      console.log('❌ No se pudo autenticar el usuario');
    }
    
  } catch (error) {
    console.error('💥 Error durante el test:', error);
  } finally {
    // No cerrar el browser para poder inspeccionar
    console.log('🔍 Browser mantenido abierto para inspección...');
    // await browser.close();
  }
}

// Verificar si puppeteer está disponible
try {
  runAuthTest();
} catch (error) {
  console.log('⚠️ Puppeteer no disponible, usando método alternativo...');
  
  // Test alternativo sin puppeteer
  console.log('🔄 Ejecutando test manual...');
  console.log('Por favor, sigue estos pasos:');
  console.log('1. Ve a http://localhost:3000/login');
  console.log('2. Usa email: empresa@demo.com, password: 123456');
  console.log('3. Después del login, navega a http://localhost:3000/company-applications');
  console.log('4. Verifica si eres redirigido al login o puedes acceder');
}