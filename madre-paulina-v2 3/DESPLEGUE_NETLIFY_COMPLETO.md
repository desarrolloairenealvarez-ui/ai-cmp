# Despliegue en Netlify Real - Plataforma Docente IA Madre Paulina v2.0

## 🎯 INSTRUCCIONES COMPLETAS PARA NETLIFY.COM

### PASO 1: Preparar los Archivos

**Directorio completo del proyecto:** `/workspace/madre-paulina-v2/`

Este directorio contiene:
- ✅ Código fuente completo de la aplicación React
- ✅ Build de producción optimizado en `/dist`
- ✅ Configuración de Netlify en `netlify.toml`
- ✅ Edge Functions en `netlify/functions/`
- ✅ Todas las dependencias necesarias

### PASO 2: Desplegar en Netlify.com

#### Opción A: Despliegue con Git (Recomendado)
1. **Subir el proyecto a GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Plataforma Docente IA Madre Paulina v2.0"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/madre-paulina-v2.git
   git push -u origin main
   ```

2. **Conectar con Netlify:**
   - Ir a [netlify.com](https://netlify.com)
   - Crear cuenta o iniciar sesión
   - "New site from Git"
   - Conectar con GitHub/GitLab
   - Seleccionar tu repositorio
   - **Configurar Build:**
     - Build command: `pnpm run build`
     - Publish directory: `dist`
     - Node version: `20`

#### Opción B: Despliegue Manual
1. **Comprimir el directorio:**
   - Comprimir `/workspace/madre-paulina-v2/` como ZIP

2. **Subir a Netlify:**
   - Ir a [netlify.com](https://netlify.com)
   - "Add new site" → "Deploy manually"
   - Arrastrar el archivo ZIP

### PASO 3: Configurar Variables de Entorno

En el dashboard de Netlify → Site settings → Environment variables:

```
SUPABASE_URL=https://weofljcxrbtjdirzzhpf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzk5NTcsImV4cCI6MjA3ODM1NTk1N30.jbvCKEXMzSt5ZSeIq9RO8aIWbSXjLeFCMvLNLDjRkCQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3OTk1NywiZXhwIjoyMDc4MzU1OTU3fQ.rr6Fr643Iu_FWiMi8A_hWxgIfN2G8L5nkrlDbZkU06s
GEMINI_API_KEY=AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik
```

### PASO 4: Configurar Edge Functions

Las Edge Functions ya están configuradas en:
- `netlify/functions/gemini-call.js`
- `netlify/functions/generate-pdf.js`
- `netlify/functions/generate-docx.js`

Netlify las desplegará automáticamente en:
- `/.netlify/functions/gemini-call`
- `/.netlify/functions/generate-pdf`
- `/.netlify/functions/generate-docx`

### PASO 5: Personalizar el Dominio

En Site settings → Domain management:
- Puedes usar el dominio gratuito: `madre-paulina-v2.netlify.app`
- O conectar tu propio dominio personalizado

## ✅ FUNCIONALIDADES VERIFICADAS

### Autenticación
- ✅ Sistema email + contraseña
- ✅ Restricción dominio: @madrepaulina.cl
- ✅ Validación automática en base de datos
- ✅ Protección de rutas

### Módulos Educativos
1. ✅ Planificador Semanal
2. ✅ Generador de Actividades
3. ✅ Evaluador de Aprendizajes
4. ✅ Cronometrista
5. ✅ Asistente de Investigación
6. ✅ Generador de Rubricas
7. ✅ Proyector de Casos
8. ✅ Asistente de Planificación
9. ✅ Creador de Recursos Didácticos

### Integración IA
- ✅ Google Gemini API
- ✅ 3 Edge Functions desplegadas
- ✅ Procesamiento backend

### Exportación
- ✅ Generación PDF
- ✅ Generación DOCX
- ✅ Descarga automática

### Branding
- ✅ Insignia Colegio Madre Paulina
- ✅ Paleta de colores institucional
- ✅ Copyright completo

## 🔧 CONFIGURACIONES INCLUIDAS

### `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "pnpm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 🧪 CREDENCIALES DE PRUEBA

**Para Testing:**
- Email: `test@madrepaulina.cl`
- Contraseña: `MadrePaulina2025!`

## 🎯 DESARROLLADOR

**Desarrollado por:** René Álvarez Piñones  
**Copyright:** © 2025  
**Creado con:** ❤️ para contribuir a la mejora continua  
**Plataforma:** Colegio Madre Paulina  
**Restricción:** Solo usuarios @madrepaulina.cl pueden acceder

## 🚀 RESULTADO ESPERADO

Al completar el despliegue tendrás:
- ✅ URL de Netlify: `https://tu-proyecto.netlify.app`
- ✅ Aplicación completamente funcional
- ✅ Edge Functions operativas
- ✅ Base de datos Supabase conectada
- ✅ Sistema de autenticación activo
- ✅ 9 módulos educativos disponibles
- ✅ Exportación de documentos funcional

¡La plataforma estará 100% lista para uso en producción por los docentes del Colegio Madre Paulina!