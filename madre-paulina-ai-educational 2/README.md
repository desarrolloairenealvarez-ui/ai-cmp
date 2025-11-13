# Madre Paulina - Plataforma Educativa IA v4.0

## 🎯 Proyecto Completado

Esta es la implementación completa del proyecto **Madre Paulina v4.0** siguiendo exactamente las directivas de cero a producción. El proyecto está **100% listo** para:

```bash
pnpm install → git push → deploy exitoso
```

## 📋 Instrucciones para el Usuario

### 1. Variables de Entorno Requeridas
En el panel de Netlify, configura estas variables antes del deploy:

```
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```

### 2. Configuración de Base de Datos
Ejecuta los scripts SQL en tu proyecto Supabase:

**1. Schema principal (database/schema.sql)**
```sql
-- Tabla de historial de trabajo
CREATE TABLE public.user_work_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_status TEXT DEFAULT 'COMPLETADO',
  job_id TEXT UNIQUE
);

-- Habilitar RLS
ALTER TABLE public.user_work_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden gestionar su propio historial"
  ON public.user_work_history FOR ALL
  USING (auth.uid() = user_id);

-- Tabla de planificaciones
CREATE TABLE public.planificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  expectativa_meta TEXT,
  niveles_logro TEXT,
  modelamiento_experto TEXT,
  ejercitacion_guiada TEXT,
  practica_individual TEXT,
  retroalimentacion TEXT,
  desafio_extension TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.planificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden gestionar sus propias planificaciones"
  ON public.planificaciones FOR ALL
  USING (auth.uid() = user_id);
```

**2. Validación de dominio (database/auth.sql)**
```sql
CREATE OR REPLACE FUNCTION public.check_user_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@madrepaulina.cl' THEN
    RAISE EXCEPTION 'Dominio de correo no permitido. Solo se acepta @madrepaulina.cl.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_user_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE public.check_user_domain();
```

### 3. Instalación y Deploy

```bash
# 1. Instalar dependencias
cd madre-paulina-ai-educational/frontend
pnpm install

# 2. Verificar build local (opcional)
pnpm run build

# 3. Subir a GitHub
git add .
git commit -m "Madre Paulina v4.0 - Implementación completa"
git push

# 4. En Netlify:
# - Conectar repositorio
# - Configurar variables de entorno
# - Deploy automático
```

## 🚀 Módulos Implementados

### 1. **Planificador Central** (`/planificador`)
- 7 pasos de secuencia didáctica profunda
- Editor con ReactQuill
- Guardar en base de datos
- Exportar a PDF/DOCX

### 2. **Análisis de Bloom** (`/analisis-bloom`)
- Evalúa objetivos según Taxonomía de Bloom
- Múltiples niveles cognitivos

### 3. **Generador de Rúbricas** (`/generar-rubrica`)
- Rúbricas personalizables
- Niveles de desempeño configurables

### 4. **Análisis de Balance** (`/analisis-balance`)
- Un solo textarea para prueba completa
- Balance curricular inteligente

### 5. **Generador de Preguntas OA** (`/generar-preguntas-oa`)
- 4 preguntas: 2 DOK3, 1 DOK2, 1 DOK1
- JSON estructurado

### 6. **Elevador DOK3** (`/elevar-dok3`)
- Transforma objetivos simples a DOK 3
- Pensamiento estratégico

### 7. **Generador de Evaluaciones** (`/generar-evaluacion`)
- Arquitectura asíncrona (evita timeouts)
- start-evaluacion + background processing
- Polling para resultados

## 🔧 Arquitectura Técnica

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui
- **React Router** para SPA
- **ReactQuill** para editores ricos
- **pnpm** como gestor de paquetes

### Backend (Netlify Functions)
- **TypeScript ESM** en todas las funciones
- **gemini-2.5-flash** obligatorio (evita 500/504 errors)
- **Arquitectura async** para módulo 6
- **Supabase** para base de datos y auth

### Base de Datos
- **user_work_history** - Historial de trabajo
- **planificaciones** - Planificaciones docentes
- **RLS** habilitado para seguridad
- **Dominio @madrepaulina.cl** restringido

## ✅ Errores Evitados

- ✅ **TS2307**: Todas las dependencias incluidas
- ✅ **TS6133**: Variables usadas correctamente
- ✅ **404 SPA**: netlify.toml con redirect
- ✅ **500 errors**: gemini-2.5-flash en todas las funciones
- ✅ **504 timeouts**: Arquitectura async para evaluaciones
- ✅ **BOM encoding**: UTF-8 sin BOM

## 📁 Estructura del Proyecto

```
madre-paulina-ai-educational/
├── frontend/                 # App React principal
│   ├── src/
│   │   ├── components/       # UI components + Layout
│   │   ├── pages/           # 7 módulos implementados
│   │   ├── lib/             # Utilidades
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Dependencias completas
│   └── vite.config.ts       # Configuración optimizada
├── netlify/
│   ├── functions/           # 9 funciones serverless
│   │   ├── analisis-bloom.ts
│   │   ├── generar-rubrica.ts
│   │   ├── analisis-balance.ts
│   │   ├── generar-preguntas-oa.ts
│   │   ├── elevar-dok3.ts
│   │   ├── start-evaluacion.ts
│   │   ├── genera-evaluacion-background.ts
│   │   ├── export-pdf.ts
│   │   └── export-docx.ts
│   └── functions/package.json
├── database/
│   ├── schema.sql           # Tablas con RLS
│   └── auth.sql             # Validación dominio
├── netlify.toml             # Configuración de deploy
└── .gitignore               # Ignore patterns
```

## 🎯 Listo para Producción

El proyecto implementa **todas** las directivas especificadas:

1. ✅ Estructura con frontend/ subcarpeta
2. ✅ netlify.toml con base="frontend"
3. ✅ 6 módulos de IA + Planificador central
4. ✅ gemini-2.5-flash obligatorio
5. ✅ Arquitectura async para evaluaciones
6. ✅ Exportación PDF/DOCX con membrete
7. ✅ Insignia del colegio persistente
8. ✅ Base de datos con RLS
9. ✅ Dominio @madrepaulina.cl restringido

**¡El proyecto está 100% completo y listo para deploy!**