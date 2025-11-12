// Netlify Function: Generar Preguntas por Objetivo de Aprendizaje
// URL: /.netlify/functions/4-generar-preguntas

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
      objetivoAprendizaje, 
      asignatura = '',
      nivelEducativo = '',
      contexto = '',
      dificultad = 'intermedio'
    } = requestData;

    if (!objetivoAprendizaje) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Objetivo de aprendizaje requerido' }),
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

Su respuesta DEBE ser un array JSON de exactamente 4 objetos. Cada objeto debe tener las claves: "pregunta" (string), "nivel_dok" (int: 1, 2, o 3).

IMPORTANTE: Para cada objetivo de aprendizaje proporcionado, genere exactamente:
- 2 preguntas de DOK 3 (Pensamiento Estratégico)
- 1 pregunta de DOK 2 (Habilidades y Conceptos)  
- 1 pregunta de DOK 1 (Pensamiento Memorístico)

Las preguntas deben ser pedagógicamente apropiadas para el contexto educativo chileno y alinearse con los estándares curriculares.`;

    const userPrompt = `
Objetivo de aprendizaje: ${objetivoAprendizaje}
Asignatura: ${asignatura}
Nivel educativo: ${nivelEducativo}
Contexto adicional: ${contexto}
Dificultad preferida: ${dificultad}

Genere las 4 preguntas específicas siguiendo la distribución DOK requerida.`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text() || 'No se pudo generar preguntas';

    // Intentar parsear como JSON para validar estructura
    let preguntas = [];
    try {
      // Extraer JSON del texto de respuesta
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        preguntas = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parseando JSON de preguntas:', parseError);
      // Si no se puede parsear, devolver el texto como está
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        preguntas: preguntas.length > 0 ? preguntas : [{ 
          pregunta: text, 
          nivel_dok: 2 
        }],
        metadata: {
          objetivo: objetivoAprendizaje,
          asignatura,
          nivelEducativo,
          dificultad,
          totalPreguntas: 4,
          distribucionDok: {
            dok1: 1,
            dok2: 1,
            dok3: 2
          }
        },
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    console.error('Error en Generar Preguntas:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al generar preguntas',
        details: error.message 
      }),
    };
  }
};