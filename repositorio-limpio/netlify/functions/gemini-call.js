// Netlify Function: Gemini AI Proxy
// URL: /.netlify/functions/gemini-call

const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' }),
      };
    }

    const requestData = JSON.parse(event.body || '{}');
    const { prompt, systemPrompt, temperature = 0.7 } = requestData;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Prompt requerido' }),
      };
    }

    // Construir prompt completo
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUsuario: ${prompt}` 
      : prompt;

    // Configurar Gemini API
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
      model: 'gemini-pro',
      generationConfig: {
        temperature,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text() || 'No se pudo generar respuesta';

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        response: text,
        usage: {
          promptTokens: 0, // Gemini API no proporciona esto directamente
          completionTokens: 0
        }
      }),
    };

  } catch (error) {
    console.error('Error en Gemini API:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message || 'Error al procesar la solicitud',
        details: error.toString()
      }),
    };
  }
};