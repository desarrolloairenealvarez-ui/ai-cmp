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
    const { objetivo_simple, contexto, module_name } = JSON.parse(event.body)
    
    if (!objetivo_simple) {
      throw new Error('Objetivo simple requerido')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const contextText = contexto ? `Contexto adicional: ${contexto}` : ''
    
    const prompt = `Eres un experto en diseño curricular chileno y experto en niveles DOK (Depth of Knowledge).

Transforma el siguiente objetivo de aprendizaje simple a nivel DOK 3 (Pensamiento Estratégico), manteniendo la esencia del contenido pero elevando la profundidad cognitiva.

Objetivo Original: ${objetivo_simple}

${contextText}

**Requisitos para DOK 3:**
- Requiere planificación estratégica o formulación de estrategias
- Debe involucrar investigación y toma de decisiones
- Incluye múltiples variables complejas
- Demuestra autorregulación y metacognición

El resultado debe:
1. Mantener la alineación con el currículum chileno
2. Especificar claramente los aprendizajes esperados
3. Incluir criterios observables de logro
4. Ser apropiado para el nivel educativo

Proporciona solo el objetivo transformado, sin explicaciones adicionales.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const objetivo_dok3 = response.text()

    // Guardar en historial (implementar después)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        objetivo_dok3,
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en elevar-dok3:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}