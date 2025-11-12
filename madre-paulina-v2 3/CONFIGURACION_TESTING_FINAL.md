# Configuración Requerida para Testing Completo

## 🎯 Objetivo
Realizar testing completo end-to-end de los 9 módulos educativos con funcionalidad de IA Gemini y exportación PDF.

## ⚠️ Pre-requisitos Críticos

### 1. Variable de Entorno GEMINI_API_KEY en Netlify

**Problema Actual**: 
Las Netlify Functions requieren `GEMINI_API_KEY` configurada en el entorno de producción para poder llamar a la API de Gemini.

**API Key Disponible**: 
```
AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik
```

**Pasos para Configurar** (2 minutos):

1. Ve a Netlify Dashboard: https://app.netlify.com
2. Selecciona el sitio: `ruc7435281ib.space.minimax.io`
3. Ve a **Site Configuration** → **Environment Variables**
4. Clic en **Add a variable**
5. Agregar:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik`
   - **Scopes**: Seleccionar "Functions"
6. Guardar cambios
7. **Re-deploy** el sitio (Netlify pedirá confirmación)

### 2. Cuenta de Prueba @madrepaulina.cl

**Problema Actual**:
El trigger de seguridad en Supabase está funcionando correctamente y **rechaza** cualquier email que no sea `@madrepaulina.cl`.

**Resultado del Intento Automático**:
```
Error: Solo se permiten correos del dominio @madrepaulina.cl
```

✅ **Esto es CORRECTO** - El sistema de seguridad está funcionando perfectamente.

**Opciones para Testing**:

#### Opción A: Crear Cuenta Real (Recomendado)
1. Usar un correo real `@madrepaulina.cl` del colegio
2. Registrarse en: https://ruc7435281ib.space.minimax.io
3. Verificar el email de confirmación de Supabase
4. Proporcionar credenciales para testing

#### Opción B: Cuenta de Prueba Temporal
Si tienes acceso al panel de administración de Google Workspace del colegio:
1. Crear usuario temporal: `pruebas-ia@madrepaulina.cl`
2. Registrarse en la plataforma
3. Usar para testing
4. Eliminar después del testing

#### Opción C: Deshabilitar Temporalmente el Trigger (NO Recomendado)
⚠️ **Compromete la seguridad** - Solo si es absolutamente necesario para desarrollo.

## 📋 Plan de Testing Completo

### Fase 1: Verificación de Infraestructura ✅
**Status**: COMPLETADO PREVIAMENTE
- ✅ UI de Login funcional
- ✅ Protección de rutas operativa
- ✅ Diseño institucional aplicado
- ✅ Responsive design verificado
- ✅ Trigger de seguridad @madrepaulina.cl funcionando

### Fase 2: Testing de Módulos IA ⏳
**Status**: PENDIENTE (Requiere configuración arriba)

Una vez configurado GEMINI_API_KEY y con cuenta @madrepaulina.cl:

#### Módulo 1: Chat con IA
- [ ] Enviar pregunta educativa
- [ ] Verificar respuesta de IA
- [ ] Probar exportación PDF
- [ ] Verificar guardado en historial

#### Módulo 2: Analizar Reactivo (Bloom + DOK)
- [ ] Ingresar pregunta de prueba
- [ ] Verificar análisis de Taxonomía de Bloom
- [ ] Verificar clasificación DOK (1-4)
- [ ] Verificar sugerencias de mejora
- [ ] Probar exportación PDF

#### Módulo 3: Elevar a DOK 3
- [ ] Ingresar pregunta básica (DOK 1-2)
- [ ] Verificar transformación a DOK 3
- [ ] Validar mantiene objetivos de aprendizaje
- [ ] Probar exportación PDF

#### Módulo 4: Generar Rúbrica
- [ ] Ingresar descripción de actividad
- [ ] Verificar generación de criterios
- [ ] Verificar niveles de desempeño (4 niveles)
- [ ] Verificar puntajes coherentes
- [ ] Probar exportación PDF

#### Módulo 5: Analizar Prueba Completa
- [ ] Ingresar prueba con múltiples preguntas
- [ ] Verificar análisis DOK por pregunta
- [ ] Verificar distribución porcentual DOK
- [ ] Verificar recomendaciones de balance
- [ ] Probar exportación PDF

#### Módulo 6: Generar Preguntas por OA
- [ ] Ingresar objetivo de aprendizaje
- [ ] Seleccionar nivel educativo
- [ ] Verificar generación de preguntas alineadas
- [ ] Verificar variedad de DOK en preguntas
- [ ] Probar exportación PDF

#### Módulo 7: Retroalimentación Constructiva
- [ ] Ingresar trabajo de estudiante
- [ ] Ingresar criterios de evaluación
- [ ] Verificar retroalimentación constructiva generada
- [ ] Verificar tono apropiado y motivador
- [ ] Probar exportación PDF

#### Módulo 8: Generar Evaluación
- [ ] Ingresar planificación de unidad
- [ ] Seleccionar tipo de evaluación
- [ ] Verificar generación de instrumento
- [ ] Verificar alineación con objetivos
- [ ] Probar exportación PDF

#### Módulo 9: Planificación Didáctica
- [ ] Ingresar tema y nivel educativo
- [ ] Verificar 7 pasos de secuencia didáctica
- [ ] Verificar objetivos de aprendizaje claros
- [ ] Verificar estrategias metodológicas
- [ ] Probar exportación PDF

### Fase 3: Testing de Integración
- [ ] Flujo completo: Planificación → Evaluación → Retroalimentación
- [ ] Verificar historial de usuario
- [ ] Verificar persistencia de datos en Supabase
- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari)

### Fase 4: Testing de Exportación
- [ ] PDF: Verificar formato profesional con encabezados CMP
- [ ] DOCX: Verificar formato editable (si implementado)
- [ ] Verificar nombres de archivo descriptivos con timestamp
- [ ] Verificar calidad de exportación (sin errores de formato)

## 📊 Métricas de Éxito

- ✅ **100% de módulos funcionando** con respuestas coherentes de IA
- ✅ **Exportación PDF operativa** en todos los módulos
- ✅ **Tiempo de respuesta < 10 segundos** por consulta IA
- ✅ **0 errores JavaScript** en consola
- ✅ **Datos persistiendo** correctamente en Supabase
- ✅ **UI responsive** en móvil, tablet, desktop

## 🚀 Próximos Pasos

1. **TÚ REALIZAS** (5 minutos):
   - Configurar GEMINI_API_KEY en Netlify
   - Proporcionar credenciales @madrepaulina.cl

2. **YO REALIZO** (30 minutos):
   - Testing exhaustivo de los 9 módulos
   - Documentación detallada de resultados
   - Reporte de bugs (si los hay)
   - Validación de exportación PDF

3. **ENTREGA FINAL**:
   - Informe completo de testing
   - Screenshots de cada módulo funcionando
   - Confirmación de plataforma lista para producción

## ⏰ Tiempo Estimado Total
- **Configuración**: 5 minutos (Usuario)
- **Testing**: 30-45 minutos (Agente)
- **Correcciones** (si necesarias): 15-30 minutos
- **TOTAL**: ~1 hora

---

**Estado Actual**: ⏳ ESPERANDO CONFIGURACIÓN DE USUARIO

Una vez completada la configuración, podré proceder inmediatamente con el testing completo y exhaustivo de todos los módulos.
