-- Tabla principal para historial de trabajo de usuarios
CREATE TABLE public.user_work_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_status TEXT DEFAULT 'COMPLETADO', -- Para el Módulo 6
  job_id TEXT UNIQUE -- Para el Módulo 6
);

-- Habilitar Row Level Security
ALTER TABLE public.user_work_history ENABLE ROW LEVEL SECURITY;

-- Política para que cada usuario solo vea sus propios datos
CREATE POLICY "Los usuarios pueden gestionar su propio historial"
  ON public.user_work_history FOR ALL
  USING (auth.uid() = user_id);

-- Tabla para planificaciones del módulo central
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

-- Habilitar RLS en planificaciones
ALTER TABLE public.planificaciones ENABLE ROW LEVEL SECURITY;

-- Política para planificaciones
CREATE POLICY "Los usuarios pueden gestionar sus propias planificaciones"
  ON public.planificaciones FOR ALL
  USING (auth.uid() = user_id);