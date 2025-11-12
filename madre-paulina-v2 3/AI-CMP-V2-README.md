# AI-CMP v2.0 - Asistente Pedagógico Colegio Madre Paulina

## 🎯 Descripción General

AI-CMP v2.0 es una aplicación web fullstack de asistente pedagógico diseñada específicamente para el Colegio Madre Paulina. Esta versión incluye mejoras significativas en arquitectura, rendimiento y funcionalidades educativas basadas en IA.

## ✨ Nuevas Características v2.0

### 🤖 Actualización del Modelo de IA
- **Migración completa a Gemini 2.5 Flash** - Modelo más rápido y eficiente
- **Contexto DOK exacto** - Implementación precisa del marco de Norman Webb
- **Prompts optimizados** - Basados en especificaciones educativas del cliente

### ⚡ Arquitectura Asíncrona Resuelta
- **Error 504 eliminado** - Generador de Evaluaciones refactorizado
- **Sistema de background jobs** - Procesamiento no bloqueante
- **Polling de estado** - Seguimiento en tiempo real del progreso

### 🎨 Mejoras de UX/UI
- **Header persistente** - Insignia del colegio siempre visible
- **Balance Cognitivo simplificado** - Un solo textarea para pruebas completas
- **Interfaz optimizada** - Eliminación de botones innecesarios

### 📄 Sistema de Exportación Universal
- **PDF con membrete** - Puppeteer + insignia institucional
- **DOCX con formato** - @turbodocx/html-to-docx
- **Botones en todos los módulos** - Exportación unificada

### 💾 Sistema de Memoria/Historial
- **Base de datos Supabase** - Persistencia robusta
- **Historial completo** - Registro de todas las actividades
- **Panel de usuario** - Visualización y exportación

## 🏗️ Arquitectura Técnica

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── Header.tsx              # Header persistente con insignia
│   ├── UserHistory.tsx         # Componente de historial
│   └── ui/                     # Componentes UI
├── pages/                      # Páginas de módulos
│   ├── DashboardPage.tsx       # Dashboard con historial integrado
│   ├── AnalizarPruebaPage.tsx  # Balance Cognitivo mejorado
│   └── ...                     # Otros módulos
├── hooks/useAIAssistant.ts     # Hook para IA
└── lib/supabase.ts            # Cliente Supabase
```

### Backend (Netlify Functions)
```
netlify/functions/
├── 1-analisis-bloom.mjs           # Análisis Bloom + DOK
├── 2-generar-rubrica.mjs          # Generador de Rúbricas
├── 3-analisis-balance.mjs         # Balance Cognitivo
├── 4-generar-preguntas.mjs        # Preguntas por Objetivo (2 DOK3 + 1 DOK2 + 1 DOK1)
├── 6-generar-evaluacion.mjs       # Entry Point Asíncrono
├── 6-generar-evaluacion-background.mjs  # Background Processing
├── 6-evaluacion-status.mjs        # Status Polling
├── 9-export-pdf.mjs              # Exportación PDF con membrete
├── 9-export-docx.mjs             # Exportación DOCX
└── package.json                   # Dependencias de funciones
```

### Base de Datos (Supabase)
```sql
-- Tabla principal para historial
user_work_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  module_name TEXT NOT NULL,
  work_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

## 🛠️ Configuración y Despliegue

### Variables de Entorno Requeridas
```bash
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Configuración de Base de Datos
1. Ejecutar el script SQL: `supabase-migration-user-work-history.sql`
2. Habilitar Row Level Security (RLS)
3. Configurar políticas de acceso

### Despliegue en Netlify
1. **Configurar build:**
   ```toml
   [build]
   publish = "dist"
   command = "pnpm run build"
   ```

2. **Variables de entorno** en Netlify Dashboard
3. **Functions directory** configurado correctamente

## 📚 Módulos Educativos

### 1. Análisis Bloom y DOK (`1-analisis-bloom.mjs`)
- Clasificación según Taxonomía de Bloom
- Nivel DOK (1-4) con justificación
- Recomendaciones pedagógicas

### 2. Generar Rúbricas (`2-generar-rubrica.mjs`)
- Rúbricas estructuradas por niveles
- Descriptores específicos
- Alineación con objetivos de aprendizaje

### 3. Balance Cognitivo (`3-analisis-balance.mjs`)
- Distribución DOK en pruebas completas
- Análisis de equilibrio cognitivo
- Recomendaciones de mejora

### 4. Preguntas por Objetivo (`4-generar-preguntas.mjs`)
- **Exactamente 4 preguntas** por objetivo
- **Distribución DOK:** 2 DOK3 + 1 DOK2 + 1 DOK1
- Contexto pedagógico chileno

### 5. Generar Evaluaciones (`6-generar-evaluacion*.mjs`)
- **Arquitectura asíncrona** para evitar 504
- Background processing
- Status polling

### 6. Sistema de Exportación (`9-export-*.mjs`)
- **PDF:** Puppeteer + membrete universal con insignia
- **DOCX:** @turbodocx/html-to-docx
- Formato institucional

## 🔧 Características Técnicas

### Rendimiento
- **Gemini 2.5 Flash** - 3x más rápido que gemini-pro
- **Background Functions** - Procesamiento asíncrono
- **Índices optimizados** - Consultas eficientes

### Seguridad
- **Row Level Security (RLS)** - Aislamiento de datos por usuario
- **Políticas de acceso** - Solo datos propios
- **CORS configurado** - Seguridad cross-origin

### Escalabilidad
- **Serverless functions** - Escalado automático
- **Base de datos PostgreSQL** - Robustez y performance
- **Frontend estático** - CDN optimizado

## 📖 Uso de los Módulos

### Flujo de Trabajo Típico
1. **Login** - Autenticación con Supabase Auth
2. **Dashboard** - Selección de módulo + historial
3. **Módulo específico** - Input de contenido educativo
4. **Procesamiento IA** - Gemini 2.5 Flash con contexto DOK
5. **Resultados** - Visualización + opciones de exportación
6. **Historial** - Registro automático en base de datos

### Exportación
- **Botones PDF/DOCX** en cada módulo
- **Membrete institucional** en PDFs
- **Formato profesional** en documentos

## 🎯 Cumplimiento de Requisitos

### ✅ Requisitos Técnicos Cumplidos
- [x] Migración a Gemini 2.5 Flash
- [x] Contexto DOK exacto implementado
- [x] Error 504 resuelto (arquitectura asíncrona)
- [x] Header persistente con insignia
- [x] Balance Cognitivo mejorado (sin + agregar)
- [x] Sistema de exportación universal
- [x] Historial de usuario con Supabase
- [x] Configuración Netlify corregida

### 📋 Módulos Verificados
- [x] Análisis Bloom/DOK - Funcional
- [x] Generar Rúbricas - Funcional  
- [x] Balance Cognitivo - UI corregida
- [x] Preguntas por Objetivo - Distribución DOK exacta
- [x] Generar Evaluaciones - Arquitectura asíncrona
- [x] Exportación PDF/DOCX - Universal con membrete
- [x] Historial - Base de datos + UI

## 📝 Notas de Implementación

### Decisiones Arquitectónicas
1. **Funciones serverless individuales** - Modularidad y escalabilidad
2. **Contexto DOK centralizado** - Consistencia en todos los módulos
3. **Background processing** - Solución robusta para procesos largos
4. **Exportación centralizada** - Reutilización y mantenimiento

### Consideraciones de Rendimiento
- **Prompts optimizados** - Menos tokens, mayor precisión
- **Índices de base de datos** - Consultas rápidas
- **Caching apropiado** - Headers de cache configurados

### Compatibilidad
- **Navegadores modernos** - ES2020+ features
- **Node.js 20+** - Versión LTS en Netlify
- **Mobile responsive** - Tailwind CSS

## 🚀 Próximos Pasos

### Para Despliegue
1. Configurar variables de entorno en Netlify
2. Ejecutar script SQL en Supabase
3. Configurar dominio personalizado
4. Testing de todos los módulos

### Para Mantenimiento
1. Monitoreo de funciones serverless
2. Backup de base de datos
3. Actualizaciones de modelo IA
4. Optimización continua

---

**Desarrollado para:** Colegio Madre Paulina  
**Versión:** 2.0  
**Tecnologías:** React, TypeScript, Netlify Functions, Supabase, Gemini 2.5 Flash  
**Fecha:** Noviembre 2025  
**Desarrollador:** René Álvarez Piñones