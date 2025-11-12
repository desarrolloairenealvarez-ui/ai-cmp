// Netlify Function: Generar Rúbricas
// URL: /.netlify/functions/2-generar-rubrica

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
    const { 
      criterio, 
      niveles = 4, 
      descripción = '',
      objetivos = [],
      competencia = '',
      asignatura = ''
    } = requestData;

    if (!criterio) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Criterio de evaluación requerido' }),
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

Genere una rúbrica de evaluación detallada y estructurada que incluya:

1. Criterio de evaluación claramente definido
2. ${niveles} niveles de desempeño (Excelente, Bueno, Satisfactorio, Necesita Mejorar)
3. Descriptores específicos para cada nivel
4. ${niveles === 4 ? 'Distribución equilibrada entre niveles DOK' : 'Enfoque pedagógico apropiado'}
5. Criterios observables y medibles
6. Conexión con objetivos de aprendizaje cuando corresponda

Formato de respuesta: JSON estructurado con rúbrica completa y lista para usar en el aula.`;

    const userPrompt = `
Criterio: ${criterio}
Niveles: ${niveles}
Descripción: ${descripción}
Objetivos de aprendizaje: ${objetivos.join(', ')}
Competencia: ${competencia}
Asignatura: ${asignatura}

Genere la rúbrica considerando el marco pedagógico del Colegio Madre Paulina.`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text() || 'No se pudo generar rúbrica';

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        rubric: text,
        parameters: {
          criterio,
          niveles,
          objetivos,
          competencia,
          asignatura
        },
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Generar Rúbrica:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al generar rúbrica',
        details: error.message 
      }),
    };
  }
};