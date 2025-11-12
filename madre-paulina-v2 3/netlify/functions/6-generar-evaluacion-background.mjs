// Netlify Function: Generar Evaluación (Background Processing)
// URL: /.netlify/functions/6-generar-evaluacion-background

const { GoogleGenerativeAI } = require('@google/generative-ai');
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
      jobID,
      titulo,
      objetivos,
      contenido,
      instrucciones,
      tiempoEstimado,
      instruccionesEspeciales
    } = requestData;

    if (!jobID || !titulo || !objetivos || !contenido) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Datos incompletos para generación' }),
      };
    }

    // Inicializar Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Actualizar estado a 'processing'
    await supabase
      .from('user_work_history')
      .update({
        work_data: {
          jobID,
          status: 'processing',
          tipo: 'evaluacion',
          titulo,
          objetivos,
          contenido,
          instructions: instrucciones,
          tiempoEstimado,
          instruccionesEspeciales,
          started_at: new Date().toISOString()
        }
      })
      .eq('work_data->>jobID', jobID);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await supabase
        .from('user_work_history')
        .update({
          work_data: {
            jobID,
            status: 'error',
            error: 'API key no configurada',
            completed_at: new Date().toISOString()
          }
        })
        .eq('work_data->>jobID', jobID);

      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'API key no configurada' }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    const systemPrompt = `${DOK_CONTEXT}

Genere una evaluación completa y estructurada que incluya:

1. **Título de la evaluación**
2. **Objetivos de aprendizaje claramente definidos**
3. **Instrucciones para estudiantes**
4. **Distribución DOK equilibrada:**
   - 40% DOK 1 (Pensamiento Memorístico)
   - 35% DOK 2 (Habilidades y Conceptos)  
   - 25% DOK 3 (Pensamiento Estratégico)
5. **Preguntas diversificadas** (opción múltiple, desarrollo, análisis, síntesis)
6. **Criterios de evaluación específicos**
7. **Tiempo estimado de aplicación**
8. **Indicaciones especiales** si aplica

La evaluación debe ser apropiada para el contexto educativo chileno y alinearse con estándares curriculares nacionales.`;

    const userPrompt = `
**Título:** ${titulo}

**Objetivos de Aprendizaje:**
${objetivos.map(obj => `• ${obj}`).join('\n')}

**Contenido a evaluar:**
${contenido}

**Instrucciones adicionales:**
${instrucciones || 'Ninguna'}

**Tiempo estimado:** ${tiempoEstimado || 'No especificado'}

**Instrucciones especiales:**
${instruccionesEspeciales || 'Ninguna'}

Genere la evaluación completa con todos los componentes requeridos.`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text() || 'No se pudo generar evaluación';

    // Actualizar estado a 'completed' con resultado
    await supabase
      .from('user_work_history')
      .update({
        work_data: {
          jobID,
          status: 'completed',
          tipo: 'evaluacion',
          titulo,
          objetivos,
          contenido,
          result: text,
          completed_at: new Date().toISOString(),
          processing_time: Date.now() - new Date(requestData.started_at).getTime()
        }
      })
      .eq('work_data->>jobID', jobID);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        jobID: jobID,
        status: 'completed',
        result: text,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Evaluación Background:', error);
    
    // Actualizar estado a 'error' si es posible
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      await supabase
        .from('user_work_history')
        .update({
          work_data: {
            jobID,
            status: 'error',
            error: error.message,
            completed_at: new Date().toISOString()
          }
        })
        .eq('work_data->>jobID', requestData.jobID);
    } catch (dbError) {
      console.error('Error actualizando estado en base de datos:', dbError);
    }

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error en procesamiento de evaluación',
        details: error.message 
      }),
    };
  }
};