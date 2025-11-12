# 🚀 GUÍA COMPLETA: Despliegue Git-Based en Netlify

## 🎯 OBJETIVO
Resolver los errores 404 en las Netlify Functions configurando un despliegue basado en Git (no drag-and-drop).

## 📋 PASOS DETALLADOS

### PASO 1: Configurar Repositorio Git

**Opción A: Usar repositorio existente (Si ya tienes cuenta en GitHub/GitLab)**
1. Ve a tu cuenta de GitHub/GitLab
2. Crea un nuevo repositorio público o privado
3. Sube el código del proyecto

**Opción B: Usar GitHub Desktop (Recomendado)**
1. Descarga GitHub Desktop desde https://desktop.github.com/
2. Instala y abre GitHub Desktop
3. Crea un repositorio nuevo
4. Agrega la carpeta del proyecto: `/workspace/madre-paulina-v2`
5. Haz commit con mensaje: "Plataforma Docente IA Madre Paulina v2.0"
6. Sube a GitHub

### PASO 2: Configurar Netlify

1. **Inicia sesión en Netlify:**
   - Ve a https://app.netlify.com
   - Inicia sesión con: desarrolloairenealvarez@gmail.com

2. **Crear nuevo sitio:**
   - Clic en "Add new site" → "Import an existing project"
   - Selecciona "GitHub" (o tu proveedor preferida)
   - Autoriza Netlify a acceder a tu cuenta de GitHub

3. **Seleccionar repositorio:**
   - Busca el repositorio del proyecto
   - Selecciona la rama `main`

### PASO 3: Configuración del Build

**Build settings críticos:**
```
Branch to deploy: main
Build command: pnpm run build
Publish directory: dist
Functions directory: netlify/functions
```

**Por defecto, Netlify debería detectar automáticamente:**
- `netlify.toml` en la raíz
- Configuraciones de redirects para SPA
- Variables de entorno (las configuraremos a continuación)

### PASO 4: Variables de Entorno (CRÍTICO)

**Ve a:** Site Settings → Build & deploy → Environment

**Agregar estas 4 variables:**

```
GEMINI_API_KEY
Valor: AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik

SUPABASE_URL
Valor: https://weofljcxrbtjdirzzhpf.supabase.co

SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzk5NTcsImV4cCI6MjA3ODM1NTk1N30.jbvCKEXMzSt5ZSeIq9RO8aIWbSXjLeFCMvLNLDjRkCQ

SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3OTk1NywiZXhwIjoyMDc4MzU1OTU3fQ.rr6Fr643Iu_FWiMi8A_hWxgIfN2G8L5nkrlDbZkU06s
```

### PASO 5: Verificar Configuración de Funciones

**En Site Settings → Functions:**
- Debe mostrar que se detectó la carpeta `netlify/functions`
- Las funciones disponibles: `gemini-call`, `generate-pdf`, `generate-docx`

### PASO 6: Ejecutar Deploy

1. **Hacer clic en "Deploy site"**
2. **Esperar a que complete el build** (puede tomar 2-3 minutos)
3. **Verificar que no hay errores** en los logs

### PASO 7: Pruebas de Verificación

**Probar estas funcionalidades:**

1. **Verificar página principal:**
   - La página debe cargar sin Error 404
   - Debe aparecer el formulario de login

2. **Probar login:**
   - Email: test@madrepaulina.cl
   - Contraseña: MadrePaulina2025!
   - Debe acceder al dashboard

3. **Probar módulos de IA (este es el test crítico):**
   - Hacer clic en "Planificación" → "Generar planificación"
   - NO debe aparecer Error 404
   - La función debe procesar y mostrar resultado

4. **Verificar Netlify Functions:**
   - La llamada a `/.netlify/functions/gemini-call` debe funcionar

## 🔍 SOLUCIÓN DE PROBLEMAS

### Error: "Command not found: pnpm"
**Solución:** Actualizar el build command a:
```bash
npm install && npm run build
```

### Error: "Directory dist not found"
**Solución:** Verificar que `pnpm run build` genere correctamente el directorio `dist/`

### Error: "Functions directory not found"
**Solución:** En Site Settings → Functions, confirmar:
- Functions directory: `netlify/functions`
- Si no se detecta automáticamente, configurarlo manualmente

### Error 404 en funciones después del deploy
**Causa probable:** Las variables de entorno no están configuradas o la conexión Git no está funcionando.

**Verificaciones:**
1. Ir a Site Settings → Deploys → Show deploy logs
2. Revisar que el build incluyó las funciones
3. Verificar que las variables de entorno están presentes

## 📋 CHECKLIST FINAL

- [ ] ✅ Repositorio Git creado y conectado
- [ ] ✅ Build settings configurados correctamente
- [ ] ✅ 4 variables de entorno agregadas
- [ ] ✅ Deploy completado sin errores
- [ ] ✅ Página principal carga sin Error 404
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Módulos de IA cargan sin Error 404
- [ ] ✅ Funciones de Netlify responden correctamente

## 🎯 RESULTADO ESPERADO

Después de seguir estos pasos correctamente:
- ✅ No más Error 404 en módulos de IA
- ✅ Las funciones de Netlify responden correctamente
- ✅ El dashboard se carga después del login
- ✅ La integración con Gemini AI funciona
- ✅ La aplicación es completamente funcional

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa los logs del deploy en Netlify
2. Verifica cada variable de entorno
3. Confirma que las funciones se detectaron correctamente
4. Prueba primero el login y luego los módulos de IA

---

**Desarrollado por MiniMax Agent**  
**Fecha: 12 de noviembre de 2025**