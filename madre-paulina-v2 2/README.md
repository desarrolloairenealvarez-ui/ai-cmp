# Plataforma Docente IA "Madre Paulina" v2.0

Aplicación web educativa con inteligencia artificial para docentes del Colegio Madre Paulina.

## 🚀 Deployment

**URL Producción**: https://adorable-druid-dc8d7e.netlify.app

**Estado**: ✅ Configurado para Git-based deployment | 🔧 Netlify Functions corregidas

## 📋 Características Principales

### Backend
- **Supabase** - Autenticación y base de datos PostgreSQL
- **10 tablas** con Row Level Security (RLS)
- **Trigger de validación** - Solo correos @madrepaulina.cl
- **Netlify Functions** - IA y exportación seguras

### Frontend
- **React 18.3** + TypeScript
- **Vite 6.0** - Build tool
- **TailwindCSS** - Diseño institucional CMP
- **9 módulos educativos** con IA

### Módulos Implementados (9/9) ✅

1. **Chat con IA** - Asistente educativo especializado
2. **Analiza Reactivo** - Clasificación Bloom y DOK
3. **Eleva a DOK 3** - Transformación automática de preguntas
4. **Genera Rúbrica** - Rúbricas de evaluación profesionales
5. **Analiza Prueba Completa** - Distribución DOK y recomendaciones
6. **Preguntas por OA** - Generación alineada a objetivos
7. **Retroalimentación** - Feedback constructivo personalizado
8. **Genera Evaluación** - Instrumentos desde planificaciones
9. **Planificación** - Secuencia didáctica en 7 pasos

## 🔧 Configuración Necesaria

### 1. Variables de Entorno en Netlify
En **Site Settings > Build & deploy > Environment Variables**:

```
GEMINI_API_KEY=AIzaSyB7B2D3gI7L6XvjHVpSUMMahAVaiXy_fik
SUPABASE_URL=https://weofljcxrbtjdirzzhpf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzk5NTcsImV4cCI6MjA3ODM1NTk1N30.jbvCKEXMzSt5ZSeIq9RO8aIWbSXjLeFCMvLNLDjRkCQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc3OTk1NywiZXhwIjoyMDc4MzU1OTU3fQ.rr6Fr643Iu_FWiMi8A_hWxgIfN2G8L5nkrlDbZkU06s
```

### 2. Configuración de Build en Netlify
- **Comando de build**: `pnpm run build`
- **Directorio de publicación**: `dist`
- **Directorio de funciones**: `netlify/functions`

### 3. Autenticación (Supabase)

- **Dominio permitido**: @madrepaulina.cl
- **Email provider**: Habilitado con validación de dominio

### 3. Testing

Requiere cuenta con correo `@madrepaulina.cl` para acceder a módulos.

## 📦 Estructura del Proyecto

```
src/
├── components/ui/      # Componentes Shadcn UI
├── contexts/          # AuthContext (Supabase)
├── hooks/             # useAIAssistant
├── lib/               # Supabase client
├── pages/             # 11 páginas (Login + Dashboard + 9 módulos)
└── App.tsx            # Router principal

netlify/functions/
├── gemini-call.js     # Proxy IA (Gemini)
├── generate-pdf.js    # Exportación PDF
└── generate-docx.js   # Exportación Word
```

## 🎨 Paleta de Colores Institucional

- **Azul oscuro**: #2b5774 (Principal)
- **Azul medio**: #4a95bf (Secundario)
- **Naranja**: #f4aa3e (Acentos)
- **Verde claro**: #78aa47 (Éxitos)
- **Verde oscuro**: #4b722d (Variantes)

## 🧪 Testing

**Testing Completado**: 8/22 tests (36%)  
**Bugs Encontrados**: 0  
**Estado**: Infraestructura 100% verificada | Funcional pendiente

### Tests Completados ✅
- ✅ UI de Login (100% pasado)
- ✅ Protección de 10 Rutas (100% pasado)
- ✅ Trigger @madrepaulina.cl (100% pasado)
- ✅ Responsive Design (100% pasado)
- ✅ Consola sin errores (100% pasado)

### Tests Pendientes ⏳
- ⏳ 9 módulos con IA (requiere GEMINI_API_KEY)
- ⏳ Exportación PDF (requiere cuenta @madrepaulina.cl)
- ⏳ Integración entre módulos
- ⏳ Cross-browser compatibility

**Ver Documentación Completa**: 
- 📊 `INFORME_TESTING_COMPLETO.md` - Reporte exhaustivo (761 líneas)
- 📋 `ESTADO_DEL_PROYECTO.md` - Estado actual y acción requerida
- 📚 `INDICE_DOCUMENTACION.md` - Guía de toda la documentación
- 📸 `testing-screenshots/` - Evidencias visuales (4 screenshots)

## 📚 Documentación

### Testing y Estado Actual
- **ESTADO_DEL_PROYECTO.md** ⭐ - Lee esto primero
- **INDICE_DOCUMENTACION.md** - Guía de navegación completa
- **INFORME_TESTING_COMPLETO.md** - Reporte exhaustivo (761 líneas)
- **RESUMEN_EJECUTIVO_TESTING.md** - Visión ejecutiva
- **REPORTE_TECNICO_UI.md** - Análisis técnico de arquitectura
- **testing-screenshots/** - 4 screenshots de evidencia

### Configuración y Guías
- **CONFIGURACION_TESTING_FINAL.md** - Pasos para completar testing
- **RESUMEN_TESTING_FINAL.md** - Guía rápida de configuración

### Documentación de Proyecto
- **ENTREGA_FINAL.md** - Especificaciones técnicas
- **test-progress-completo.md** - Plan de testing estructurado

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

## 📄 Licencia

Desarrollado para el Colegio Madre Paulina  
© 2025 - Todos los derechos reservados

---

**Desarrollado por**: MiniMax Agent  
**Versión**: 2.0.0  
**Fecha**: 11 de noviembre de 2025
