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
    const { objetivo_aprendizaje, module_name } = JSON.parse(event.body)
    
    if (!objetivo_aprendizaje) {
      throw new Error('Objetivo de aprendizaje requerido')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `Eres un experto en diseño curricular basado en DOK y el currículum chileno.

Basado en el siguiente Objetivo de Aprendizaje (OA), genera exactamente 4 preguntas: 2 preguntas de DOK 3 (Pensamiento Estratégico), 1 pregunta de DOK 2 (Habilidades/Conceptos) y 1 pregunta de DOK 1 (Memorístico).

Objetivo de Aprendizaje: ${objetivo_aprendizaje}

Responde únicamente con un array JSON, donde cada objeto tenga las claves "pregunta" y "dok_level" (ej: 3, 2, o 1).

Formato requerido:
[
  {"pregunta": "...", "dok_level": 3},
  {"pregunta": "...", "dok_level": 3}, 
  {"pregunta": "...", "dok_level": 2},
  {"pregunta": "...", "dok_level": 1}
]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parsear el JSON de la respuesta
    let preguntasJson
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const cleanText = text.replace(/```json\s*|\s*```/g, '')
      preguntasJson = JSON.parse(cleanText)
    } catch (parseError) {
      // Si falla el parseo, devolver las preguntas en formato HTML
      const formattedQuestions = text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          preguntas: formattedQuestions,
          success: true
        })
      }
    }

    // Formatear las preguntas para el frontend
    const formattedQuestions = preguntasJson.map((q: any, index: number) => 
      `<div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #3B82F6; background: #F8FAFC;">
        <strong>Pregunta ${index + 1} (DOK ${q.dok_level}):</strong><br>
        ${q.pregunta}
      </div>`
    ).join('')

    // Guardar en historial (implementar después)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        preguntas: formattedQuestions,
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en generar-preguntas-oa:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}