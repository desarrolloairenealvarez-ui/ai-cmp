// Netlify Function: Generar Evaluación (Síncrona - Entry Point)
// URL: /.netlify/functions/6-generar-evaluacion

const { createClient } = require('@supabase/supabase-js');

// Contexto DOK exacto según especificaciones del cliente
const DOK_CONTEXT = `
Usted es un experto en pedagogía y debe generar preguntas o análisis basados estrictamente en el marco de Profundidad del Conocimiento (DOK) de Norman Webb.

DOK Nivel 1 (Pensamiento Memorístico): Implica recordar hechos, definiciones y realizar procedimientos rutinarios de un solo paso.

DOK Nivel 2 (Habilidades y Conceptos): Requiere aplicar conocimientos para procesar información, comparar, clasificar o realizar tareas de varios pasos.

DOK Nivel 3 (Pensamiento Estratégico): Involucra razonamiento, planificación y uso de evidencia para resolver problemas complejos y abstractos que a menudo no tienen una única respuesta correcta.

DOK Nivel 4 (Pensamiento Extendido): Exige razonamiento complejo, investigación, síntesis de ideas de múltiples fuentes y creación de algo nuevo, generalmente a lo largo de un período de tiempo extendido.
`;

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: null,
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' }),
      };
    }

    const requestData = JSON.parse(event.body || '{}');
    const {
      titulo,
      objetivos,
      contenido,
      instrucciones,
      tiempoEstimado,
      instruccionesEspeciales
    } = requestData;

    if (!titulo || !objetivos || !contenido) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Título, objetivos y contenido son requeridos para generar evaluación' 
        }),
      };
    }

    // Generar jobID único
    const jobID = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Preparar payload para la función de background
    const payload = {
      jobID,
      titulo,
      objetivos,
      contenido,
      instrucciones,
      tiempoEstimado,
      instruccionesEspeciales,
      created_at: new Date().toISOString()
    };

    // Inicializar Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Crear registro inicial en base de datos
    const { error: dbError } = await supabase
      .from('user_work_history')
      .insert({
        user_id: context.clientContext?.user?.sub || 'anonymous',
        module_name: 'GenerarEvaluacion',
        work_data: {
          jobID,
          status: 'pending',
          tipo: 'evaluacion',
          metadata: payload
        },
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Error creando registro en base de datos:', dbError);
    }

    // Invocar función de background (en producción, esto sería una invocación real)
    // Por ahora, simulamos la invocación para demostración
    try {
      // En un entorno real, esto sería:
      // await fetch(`${process.env.NETLIFY_SITE_URL}/.netlify/functions/6-generar-evaluacion-background`, {
      //   method: 'POST',
      //   body: JSON.stringify(payload)
      // });
      
      console.log(`Job ${jobID} iniciado - invocando función de background`);
    } catch (invokeError) {
      console.error('Error invocando función de background:', invokeError);
      // Continuar aunque falle la invocación
    }

    // Devolver respuesta inmediata con jobID
    return {
      statusCode: 202, // Accepted
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Evaluación iniciada para procesamiento en background',
        jobID: jobID,
        statusEndpoint: `/6-evaluacion-status?id=${jobID}`,
        estimatedTime: '2-5 minutos',
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Generar Evaluación (Entry):', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al iniciar generación de evaluación',
        details: error.message 
      }),
    };
  }
};