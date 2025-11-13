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
    const { prueba_completa, module_name } = JSON.parse(event.body)
    
    if (!prueba_completa) {
      throw new Error('Prueba completa requerida')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `Eres un experto en análisis curricular y diseño de evaluaciones del currículum chileno.

Analiza la siguiente prueba o evaluación y proporciona un análisis detallado del balance curricular:

${prueba_completa}

Tu análisis debe incluir:

1. **Distribución de contenidos**: ¿Está equilibrada la cobertura de los temas principales?

2. **Niveles DOK (Depth of Knowledge)**: 
   - DOK 1: Recordación de hechos básicos
   - DOK 2: Conceptos y habilidades  
   - DOK 3: Pensamiento estratégico
   - DOK 4: Extensión compleja

3. **Tipos de preguntas**: Selección múltiple, desarrollo, análisis, etc.

4. **Recomendaciones**: Sugerencias para mejorar el balance y la calidad

5. **Alineación curricular**: Verificación con objetivos de aprendizaje

Proporciona un análisis constructivo y específico.`

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
    console.error('Error en analisis-balance:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}