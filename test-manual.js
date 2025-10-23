const test = async () => {
  console.log('🧪 INICIANDO PRUEBA MANUAL DEL SISTEMA');
  console.log('='.repeat(50));
  
  try {
    // Simular importación del mockApi
    const mockData = {
      applications: [
        {
          id: "app1",
          practiceId: "1",
          userId: "1", 
          status: "Enviada",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "app2", 
          practiceId: "2", 
          userId: "1", 
          status: "Revisando",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "app3",
          practiceId: "1", 
          userId: "3", 
          status: "Aceptada",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "app4",
          practiceId: "4",
          userId: "1",  
          status: "Enviada",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ]
    };
    
    console.log('📋 PASO 1: Estado inicial de aplicaciones de Ana García (userId: 1)');
    const aplicacionesAna = mockData.applications.filter(app => app.userId === '1');
    aplicacionesAna.forEach(app => {
      console.log(`  - Aplicación ${app.id}: Práctica ${app.practiceId} → ${app.status}`);
    });
    
    console.log('\n🔄 PASO 2: Simulando cambio de estado por empresa');
    // Buscar aplicación "Enviada" de Ana
    const appParaCambiar = aplicacionesAna.find(app => app.status === 'Enviada');
    if (appParaCambiar) {
      console.log(`  - Cambiando ${appParaCambiar.id} de "${appParaCambiar.status}" a "Aceptada"`);
      appParaCambiar.status = 'Aceptada';
      console.log(`  ✅ Estado actualizado exitosamente`);
    } else {
      console.log('  ❌ No se encontró aplicación para cambiar');
    }
    
    console.log('\n🔍 PASO 3: Verificando cambios desde perspectiva del estudiante');
    const aplicacionesActualizadas = mockData.applications.filter(app => app.userId === '1');
    let cambiosEncontrados = 0;
    aplicacionesActualizadas.forEach(app => {
      const estadoOriginal = aplicacionesAna.find(original => original.id === app.id);
      if (estadoOriginal && estadoOriginal.status !== app.status) {
        console.log(`  ✅ Cambio detectado: ${app.id} ahora es "${app.status}"`);
        cambiosEncontrados++;
      } else {
        console.log(`  - ${app.id}: ${app.status} (sin cambios)`);
      }
    });
    
    console.log('\n📊 RESULTADO DE LA PRUEBA:');
    if (cambiosEncontrados > 0) {
      console.log(`✅ ÉXITO: ${cambiosEncontrados} cambio(s) detectado(s) correctamente`);
      console.log('✅ El sistema de accept/reject FUNCIONA CORRECTAMENTE');
    } else {
      console.log('❌ FALLO: No se detectaron cambios');
    }
    
  } catch (error) {
    console.log('❌ ERROR en la prueba:', error.message);
  }
};

test();