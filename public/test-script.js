// Script de prueba para verificar datos de aplicaciones
// Ejecutar en consola del navegador

console.log('🧪 INICIANDO VERIFICACIÓN MANUAL DE DATOS');
console.log('='.repeat(50));

// Verificar si mockApi está disponible
if (typeof window !== 'undefined' && window.mockApi) {
    console.log('✅ mockApi disponible');
} else {
    console.log('❌ mockApi no disponible, importando...');
}

// Función para verificar datos paso a paso
async function verificarDatos() {
    try {
        // Simular importación si no está disponible
        const { mockApi } = await import('../src/mocks/api.js');
        
        console.log('\n📋 PASO 1: Aplicaciones del estudiante Ana García (ID: 1)');
        const aplicacionesEstudiante = await mockApi.listApplications('1');
        console.log(`Número de aplicaciones: ${aplicacionesEstudiante.length}`);
        aplicacionesEstudiante.forEach(app => {
            console.log(`- App ${app.id}: Práctica ${app.practiceId} → Estado: ${app.status}`);
        });
        
        console.log('\n🏢 PASO 2: Aplicaciones que puede gestionar la empresa (ID: 2)');
        const todasAplicaciones = await mockApi.listApplications('all');
        const todasPracticas = await mockApi.listPractices();
        
        const aplicacionesEmpresa = todasAplicaciones.filter(app => {
            const practica = todasPracticas.find(p => p.id === app.practiceId);
            return practica?.company.ownerUserId === '2';
        });
        
        console.log(`Número de aplicaciones para gestionar: ${aplicacionesEmpresa.length}`);
        aplicacionesEmpresa.forEach(app => {
            const practica = todasPracticas.find(p => p.id === app.practiceId);
            console.log(`- App ${app.id}: ${practica?.title} → Usuario ${app.userId} → Estado: ${app.status}`);
        });
        
        console.log('\n✅ DATOS INICIALES VERIFICADOS');
        return { aplicacionesEstudiante, aplicacionesEmpresa };
        
    } catch (error) {
        console.error('❌ Error verificando datos:', error);
    }
}

// Función para ejecutar prueba de cambio de estado
async function probarCambioEstado() {
    try {
        const { mockApi } = await import('../src/mocks/api.js');
        
        console.log('\n🔄 PASO 3: Cambiar estado de aplicación');
        
        // Encontrar una aplicación en estado "Enviada"
        const todasAplicaciones = await mockApi.listApplications('all');
        const appEnviada = todasAplicaciones.find(app => app.status === 'Enviada');
        
        if (!appEnviada) {
            console.log('❌ No se encontró aplicación en estado "Enviada"');
            return;
        }
        
        console.log(`Aplicación encontrada: ${appEnviada.id} (Estado: ${appEnviada.status})`);
        
        // Cambiar a "Aceptada"
        await mockApi.updateApplicationStatus(appEnviada.id, 'Aceptada', '2');
        console.log(`✅ Estado cambiado a "Aceptada"`);
        
        // Verificar cambio
        const aplicacionesActualizadas = await mockApi.listApplications('1');
        const appActualizada = aplicacionesActualizadas.find(app => app.id === appEnviada.id);
        
        if (appActualizada && appActualizada.status === 'Aceptada') {
            console.log(`✅ VERIFICACIÓN EXITOSA: Aplicación ${appEnviada.id} ahora muestra estado "Aceptada"`);
        } else {
            console.log(`❌ VERIFICACIÓN FALLIDA: Estado no se actualizó correctamente`);
        }
        
        return appActualizada;
        
    } catch (error) {
        console.error('❌ Error en prueba de cambio:', error);
    }
}

// Exportar funciones para uso manual
window.verificarDatos = verificarDatos;
window.probarCambioEstado = probarCambioEstado;

console.log('\n💡 FUNCIONES DISPONIBLES:');
console.log('- verificarDatos() - Ver estado inicial');
console.log('- probarCambioEstado() - Probar cambio de estado');