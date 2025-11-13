import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function handler(event: any, context: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { asignatura, criterios, niveles, module_name } = JSON.parse(event.body)
    
    if (!asignatura || !criterios || !niveles) {
      throw new Error('Asignatura, criterios y niveles son requeridos')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `Eres un experto en diseño de rúbricas de evaluación alineadas con el currículum chileno.

Genera una rúbrica de evaluación completa para la asignatura "${asignatura}" con las siguientes características:

Criterios: ${criterios}
Número de niveles: ${niveles}

La rúbrica debe incluir:
1. Título descriptivo
2. Criterios de evaluación específicos
3. Descriptores para cada nivel de desempeño
4. Alineación con objetivos de aprendizaje
5. Formato profesional y claro

Asegúrate de que sea apropiada para el nivel educativo y el currículum chileno.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const rubrica = response.text()

    // Guardar en historial (implementar después)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        rubrica,
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en generar-rubrica:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}