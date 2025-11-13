-- Función para validar dominio de email
CREATE OR REPLACE FUNCTION public.check_user_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@madrepaulina.cl' THEN
    RAISE EXCEPTION 'Dominio de correo no permitido. Solo se acepta @madrepaulina.cl.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para validar dominio antes de insertar usuario
CREATE TRIGGER check_user_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE public.check_user_domain();