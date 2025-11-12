-- Script SQL para crear la tabla user_work_history en Supabase
-- Ejecutar en el Editor SQL de Supabase

-- Crear tabla para historial de trabajo del usuario
CREATE TABLE user_work_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  work_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_user_work_user_id ON user_work_history(user_id);
CREATE INDEX idx_user_work_created_at ON user_work_history(created_at DESC);
CREATE INDEX idx_user_work_module ON user_work_history(module_name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_work_history ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo su propio historial
CREATE POLICY "Usuarios pueden ver su propio historial"
  ON user_work_history FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar en su propio historial
CREATE POLICY "Usuarios pueden insertar su propio historial"
  ON user_work_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar su propio historial
CREATE POLICY "Usuarios pueden actualizar su propio historial"
  ON user_work_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar el timestamp de updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_user_work_history_updated_at
    BEFORE UPDATE ON user_work_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE user_work_history IS 'Historial de trabajo de cada usuario en el asistente pedagógico';
COMMENT ON COLUMN user_work_history.id IS 'Identificador único del registro';
COMMENT ON COLUMN user_work_history.user_id IS 'ID del usuario (foreign key a auth.users)';
COMMENT ON COLUMN user_work_history.module_name IS 'Nombre del módulo utilizado (ChatIA, GenerarRubrica, etc.)';
COMMENT ON COLUMN user_work_history.work_data IS 'Datos del trabajo realizado en formato JSON';
COMMENT ON COLUMN user_work_history.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN user_work_history.updated_at IS 'Fecha y hora de última actualización del registro';

-- Insertar datos de ejemplo (opcional - para testing)
-- INSERT INTO user_work_history (user_id, module_name, work_data) 
-- VALUES (
--   (SELECT id FROM auth.users LIMIT 1),
--   'ChatIA',
--   '{"message": "Hola, necesito ayuda con planificación", "response": "Te ayudo con tu planificación"}'
-- );