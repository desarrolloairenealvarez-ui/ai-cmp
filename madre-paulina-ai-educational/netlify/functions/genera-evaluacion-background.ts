import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
)

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
    const { job_id, prompt, module_name } = JSON.parse(event.body)
    
    if (!job_id || !prompt) {
      throw new Error('job_id y prompt requeridos')
    }

    console.log(`Iniciando generación de evaluación para job_id: ${job_id}`)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const systemPrompt = `Eres un experto en diseño de evaluaciones educativas del currículum chileno.

Genera una evaluación completa basada en el siguiente prompt:

${prompt}

La evaluación debe incluir:
1. **Estructura clara** con diferentes tipos de preguntas
2. **Alineación curricular** con objetivos de aprendizaje chilenos
3. **Variedad de niveles DOK** (1-4)
4. **Instrucciones claras** para cada sección
5. **Criterios de evaluación** cuando sea apropiado
6. **Formato profesional** listo para aplicar

Proporciona una evaluación detallada, completa y lista para usar.`

    // Generar la evaluación (puede tardar varios minutos)
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const evaluacion = response.text()

    console.log(`Evaluación generada para job_id: ${job_id}`)

    // Actualizar el registro en user_work_history con el resultado
    const { error: updateError } = await supabase
      .from('user_work_history')
      .update({
        output_data: { evaluacion },
        job_status: 'COMPLETADO'
      })
      .eq('job_id', job_id)

    if (updateError) {
      throw new Error(`Error updating job: ${updateError.message}`)
    }

    console.log(`Job ${job_id} completado exitosamente`)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Evaluación completada exitosamente',
        job_id,
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en genera-evaluacion-background:', error)
    
    // Actualizar el estado del job como fallido
    try {
      const { job_id } = JSON.parse(event.body)
      if (job_id) {
        await supabase
          .from('user_work_history')
          .update({
            job_status: 'FALLIDO',
            output_data: { error: error.message }
          })
          .eq('job_id', job_id)
      }
    } catch (updateError) {
      console.error('Error updating failed job:', updateError)
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}