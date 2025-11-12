# AI-CMP v2 Fixed - Asistente Pedagógico Colegio Madre Paulina

Este es el proyecto corregido y refactorizado del Asistente Pedagógico con IA para el Colegio Madre Paulina.

## 🚀 Correcciones Implementadas

### FASE 1: Reparación del Build
✅ **Instalación de dependencias faltantes:**
- `class-variance-authority`
- `@radix-ui/react-slot` 
- `clsx`
- `tailwind-merge`
- `html2pdf.js`
- `@types/html2pdf.js`

✅ **Limpieza de código TypeScript:**
- Eliminadas importaciones no utilizadas en todos los archivos
- Corregidos errores TS6133 (importaciones no usadas)
- Corregidos errores TS2307 (módulos no encontrados)

### FASE 2: Refactorización del Backend
✅ **Actualización del modelo de IA:**
- Cambiado de `gemini-pro` a `gemini-2.5-flash` en todas las funciones
- Implementado en: `gemini-call.js`, `1-analisis-bloom.mjs`, `2-generar-rubrica.mjs`, `3-analisis-balance.mjs`, `4-generar-preguntas.mjs`, `6-generar-evaluacion-background.mjs`

✅ **Funciones de Background:**
- Implementada función `6-generar-evaluacion-background.mjs` para procesos largos
- Configurada para 15 minutos de timeout

✅ **Manejo de errores robusto:**
- Implementados bloques `try-catch` en todas las funciones
- Respuestas HTTP 500 con mensajes de error claros
- Logging detallado para debugging

### FASE 3: Corrección Funcional
✅ **Módulos corregidos:**
- Módulo 1 (Análisis Bloom): Funcionando con gemini-2.5-flash
- Módulo 2 (Generar Rúbrica): Funcionando con gemini-2.5-flash  
- Módulo 3 (Análisis Balance): UI actualizada con textarea único
- Módulo 4 (Generar Preguntas): System prompt corregido con distribución DOK (2 DOK 3, 1 DOK 2, 1 DOK 1)

### FASE 4: Nuevas Características
✅ **Insignia persistente:**
- Visible en el layout principal (DashboardPage.tsx)
- Insignia del Colegio Madre Paulina en todas las páginas

✅ **Memoria de Trabajo:**
- Script SQL para tabla `user_work_history` en `supabase-schema.sql`
- Políticas RLS configuradas para seguridad
- Integración con todas las funciones de IA

✅ **Exportación Universal:**
- Función `9-export-pdf.mjs` con puppeteer y membrete
- Función `9-export-docx.mjs` con @turbodocx/html-to-docx
- Insignia incluida en headers de PDF

## 📦 Instalación y Despliegue

### 1. Requisitos Previos
- Node.js 20+
- pnpm
- Cuenta de Supabase
- API Key de Gemini

### 2. Variables de Entorno (Configurar en Netlify)
```env
GEMINI_API_KEY=tu_api_key_de_gemini
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```

### 3. Configurar Supabase
Ejecutar el script SQL en tu proyecto Supabase:
```bash
# Copiar y ejecutar el contenido de supabase-schema.sql en el SQL Editor de Supabase
```

### 4. Desplegar en Netlify
1. Conectar el repositorio con Netlify
2. Configurar las variables de entorno
3. Netlify detectará automáticamente el `netlify.toml`
4. El build se ejecutará automáticamente

### 5. Variables Requeridas en Netlify Dashboard
- `GEMINI_API_KEY`: Tu API key de Google Gemini
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key de Supabase

## 🏗️ Estructura del Proyecto

```
ai-cmp-v2-fixed/
├── public/                    # Archivos estáticos
│   └── insignia-madre-paulina.png
├── src/                       # Código fuente React
│   ├── components/            # Componentes reutilizables
│   ├── pages/                # Páginas de la aplicación
│   ├── hooks/                # Custom hooks
│   ├── contexts/             # Contextos React
│   └── lib/                  # Utilidades
├── netlify/                  # Funciones serverless
│   └── functions/            # Edge functions de Netlify
├── supabase-schema.sql       # Schema de base de datos
├── netlify.toml             # Configuración de Netlify
├── .gitignore               # Archivos ignorados por Git
└── package.json             # Dependencias del proyecto
```

## 🔧 Funcionalidades

### Módulos Principales
1. **Chat IA**: Asistente educativo conversacional
2. **Analizar Reactivo**: Clasifica preguntas según Bloom y DOK
3. **Eleva a DOK 3**: Transforma preguntas básicas en DOK 3
4. **Generar Rúbrica**: Crea rúbricas detalladas de evaluación
5. **Analizar Prueba**: Balance cognitivo de evaluaciones
6. **Preguntas por OA**: Genera preguntas según objetivos
7. **Retroalimentación**: Feedback constructivo para estudiantes
8. **Generar Evaluación**: Crea evaluaciones desde planificaciones
9. **Planificación**: Asistente para planificaciones didácticas

### Funciones de Exportación
- **Exportar PDF**: Con membrete del Colegio Madre Paulina
- **Exportar DOCX**: Compatible con Microsoft Word

### Memoria de Trabajo
- Almacena historial de trabajo por usuario
- Integración con Supabase para persistencia
- Políticas de seguridad RLS

## 📝 Notas Importantes

1. **API Key de Gemini**: Asegúrate de configurar la API key en Netlify
2. **Supabase**: Ejecuta el schema SQL antes del primer despliegue
3. **Build**: El proyecto usa Vite para el build, configurado en `netlify.toml`
4. **SPA**: Las rutas están configuradas para SPA con redirect en `netlify.toml`

## 🐛 Resolución de Problemas

### Build falla con errores TypeScript
- Las dependencias faltantes ya están instaladas
- Las importaciones no utilizadas han sido eliminadas

### Error 500 en funciones
- Verificar que `GEMINI_API_KEY` esté configurada
- Revisar logs de Netlify para detalles específicos

### Problemas de CORS
- Las funciones incluyen headers CORS apropiados
- Configuración en `netlify.toml`

## 📞 Soporte

Para problemas o consultas, revisar:
1. Logs de Netlify Functions
2. Console del navegador (errores de frontend)
3. Variables de entorno en Netlify dashboard

---

**Versión**: v2 Fixed  
**Fecha**: Noviembre 2024  
**Desarrollado para**: Colegio Madre Paulina
