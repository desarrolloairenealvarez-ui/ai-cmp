import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function handler(event: any, context: any) {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { objetivos, module_name } = JSON.parse(event.body)
    
    if (!objetivos) {
      throw new Error('Objetivos de aprendizaje requeridos')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `Eres un experto en la Taxonomía de Bloom y diseño curricular del currículum chileno. 

Analiza los siguientes objetivos de aprendizaje y proporciona un análisis detallado que incluya:

1. Clasificación según la Taxonomía de Bloom (Recordar, Entender, Aplicar, Analizar, Evaluar, Crear)
2. Nivel de complejidad cognitiva
3. Recomendaciones para elevar el nivel si es necesario
4. Alineación con objetivos curriculares

Objetivos a analizar:
${objetivos}

Proporciona un análisis estructurado y educativo.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analisis = response.text()

    // Guardar en historial (implementar después)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        analisis,
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en analisis-bloom:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}