// Netlify Function: Análisis de Balance Cognitivo
// URL: /.netlify/functions/3-analisis-balance

const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const { examContent, type = 'examen' } = requestData;

    if (!examContent) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Contenido del examen/prueba requerido' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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

Analice el siguiente ${type} y proporcione un análisis completo de balance cognitivo que incluya:

1. Distribución de preguntas por nivel DOK (1-4)
2. Porcentajes de distribución
3. Evaluación del equilibrio cognitivo
4. Recomendaciones específicas para mejorar el balance
5. Sugerencias de preguntas adicionales si es necesario
6. Análisis de la progresión lógica entre niveles

Formato de respuesta: JSON estructurado con análisis detallado, estadísticas claras y recomendaciones accionables para docentes.`;

    const fullPrompt = `${systemPrompt}\n\n${type} a analizar:\n${examContent}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text() || 'No se pudo generar análisis de balance';

    // Contar preguntas DOK del contenido para estadísticas
    const dok1Count = (text.match(/DOK\s*1|nivel\s*1|memorístico/gi) || []).length;
    const dok2Count = (text.match(/DOK\s*2|nivel\s*2|conceptos/gi) || []).length;
    const dok3Count = (text.match(/DOK\s*3|nivel\s*3|estratégico/gi) || []).length;
    const dok4Count = (text.match(/DOK\s*4|nivel\s*4|extendido/gi) || []).length;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        analysis: text,
        statistics: {
          dok1: dok1Count,
          dok2: dok2Count,
          dok3: dok3Count,
          dok4: dok4Count,
          total: dok1Count + dok2Count + dok3Count + dok4Count
        },
        type: type,
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Análisis Balance Cognitivo:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al procesar análisis de balance cognitivo',
        details: error.message 
      }),
    };
  }
};