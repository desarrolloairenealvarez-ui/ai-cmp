// Netlify Function: Status Polling para Evaluaciones
// URL: /.netlify/functions/6-evaluacion-status

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' }),
      };
    }

    // Extraer jobID de los parámetros de consulta
    const url = new URL(event.rawUrl);
    const jobID = url.searchParams.get('id');

    if (!jobID) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'ID de trabajo requerido (parámetro ?id=)' }),
      };
    }

    // Inicializar Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Consultar el estado del trabajo
    const { data, error } = await supabase
      .from('user_work_history')
      .select('*')
      .eq('work_data->>jobID', jobID)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error consultando estado:', error);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Error consultando estado del trabajo' }),
      };
    }

    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Trabajo no encontrado' }),
      };
    }

    const workData = data[0].work_data;

    // Responder con el estado actual
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        jobID: jobID,
        status: workData.status || 'unknown',
        result: workData.result || null,
        error: workData.error || null,
        metadata: {
          tipo: workData.tipo,
          titulo: workData.titulo,
          started_at: workData.started_at,
          completed_at: workData.completed_at,
          processing_time: workData.processing_time
        },
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Status Endpoint:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      }),
    };
  }
};