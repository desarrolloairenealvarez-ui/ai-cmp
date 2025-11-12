# Despliegue en Netlify - Plataforma Docente IA Madre Paulina

## Instrucciones para Desplegar en Netlify

### 1. Requisitos Previos
- Cuenta de Netlify (gratuita)
- Repositorio con la aplicación construida

### 2. Configuración de Variables de Entorno

En el dashboard de Netlify, configura las siguientes variables de entorno:

```
SUPABASE_URL=https://weofljcxrbtjdirzzhpf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzk5NTcsImV4cCI6MjA3ODM1NTk1N30.jbvCKEXMzSt5ZSeIq9RO8aIWbSXjLeFCMvLNLDjRkCQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3OTk1NywiZXhwIjoyMDc4MzU1OTU3fQ.rr6Fr643Iu_FWiMi8A_hWxgIfN2G8L5nkrlDbZkU06s
GEMINI_API_KEY=AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik
```

### 3. Configuración de Functions

Las Edge Functions están incluidas en la configuración de Netlify:
- `/.netlify/functions/gemini-call` - Llamadas a Gemini AI
- `/.netlify/functions/generate-pdf` - Generación de PDFs
- `/.netlify/functions/generate-docx` - Generación de documentos DOCX

### 4. Build Settings

En la configuración del proyecto en Netlify:

- **Build command**: `pnpm run build`
- **Publish directory**: `dist`
- **Node version**: `20`

### 5. Funcionalidades Incluidas

✅ **Autenticación Segura**
- Sistema email + contraseña
- Restricción de dominio: @madrepaulina.cl
- Validación automática en base de datos

✅ **9 Módulos Educativos**
1. Planificador Semanal
2. Generador de Actividades
3. Evaluador de Aprendizajes
4. Cronometrista
5. Asistente de Investigación
6. Generador de Rubricas
7. Proyector de Casos
8. Asistente de Planificación
9. Creador de Recursos Didácticos

✅ **Integración IA**
- Google Gemini AI para generación de contenido
- 3 Edge Functions para procesamiento backend

✅ **Exportación de Documentos**
- Generación de PDF
- Generación de documentos DOCX
- Descarga automática

✅ **Branding Institucional**
- Insignia del Colegio Madre Paulina en login y dashboard
- Paleta de colores institucional
- Copyright y desarrollador: "René Álvarez Piñones"

### 6. Cuenta de Prueba

Para testing:
- **Email**: test@madrepaulina.cl
- **Contraseña**: MadrePaulina2025!

### 7. Archivos de Configuración

- `netlify.toml` - Configuración principal de Netlify
- `netlify/functions/gemini-call.js` - Función de Gemini AI
- `netlify/functions/generate-pdf.js` - Generación de PDF
- `netlify/functions/generate-docx.js` - Generación de DOCX

### 8. Post-Despliegue

Después del despliegue exitoso:
1. Verificar que la aplicación carga correctamente
2. Probar el login con credenciales válidas
3. Verificar funcionamiento de los 9 módulos
4. Probar exportación de documentos
5. Confirmar que la integración con Gemini funciona

### 9. Soporte Técnico

**Desarrollador**: René Álvarez Piñones  
**Copyright**: © 2025  
**Plataforma**: Creado con ❤️ para contribuir a la mejora continua  
**Dominio Restringido**: Solo usuarios @madrepaulina.cl pueden acceder