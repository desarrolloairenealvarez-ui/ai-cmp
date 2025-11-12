-- Script SQL para "Memoria de Trabajo" - Colegio Madre Paulina
-- Crear tabla user_work_history para almacenar historial de trabajo de usuarios

-- 1. Crear tabla user_work_history
CREATE TABLE IF NOT EXISTS user_work_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_work_history_user_id ON user_work_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_work_history_module ON user_work_history(module_name);
CREATE INDEX IF NOT EXISTS idx_user_work_history_created_at ON user_work_history(created_at);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE user_work_history ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas RLS para que usuarios solo puedan ver/gestionar sus propios registros

-- Política para SELECT: Los usuarios solo pueden ver sus propios registros
CREATE POLICY "Users can view own work history" ON user_work_history
    FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT: Los usuarios solo pueden crear registros con su propio user_id
CREATE POLICY "Users can insert own work history" ON user_work_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: Los usuarios solo pueden actualizar sus propios registros
CREATE POLICY "Users can update own work history" ON user_work_history
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: Los usuarios solo pueden eliminar sus propios registros
CREATE POLICY "Users can delete own work history" ON user_work_history
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Crear función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_user_work_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER trigger_update_user_work_history_updated_at
    BEFORE UPDATE ON user_work_history
    FOR EACH ROW
    EXECUTE FUNCTION update_user_work_history_updated_at();

-- 7. Comentarios para documentación
COMMENT ON TABLE user_work_history IS 'Historial de trabajo de usuarios - Memoria de Trabajo del sistema';
COMMENT ON COLUMN user_work_history.user_id IS 'ID del usuario (FK a auth.users)';
COMMENT ON COLUMN user_work_history.module_name IS 'Nombre del módulo utilizado (ej: ChatIA, GenerarEvaluacion, etc.)';
COMMENT ON COLUMN user_work_history.input_data IS 'Datos de entrada del usuario (JSON)';
COMMENT ON COLUMN user_work_history.output_data IS 'Resultados generados por la IA (JSON)';
COMMENT ON COLUMN user_work_history.status IS 'Estado del trabajo: pending, processing, completed, error';
