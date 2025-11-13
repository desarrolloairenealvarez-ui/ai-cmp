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
    const { prompt, module_name } = JSON.parse(event.body)
    
    if (!prompt) {
      throw new Error('Prompt requerido')
    }

    // Generar job_id único
    const jobId = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insertar en user_work_history con estado PENDIENTE
    const { error: insertError } = await supabase
      .from('user_work_history')
      .insert({
        module_name: module_name || 'generar-evaluacion',
        input_data: { prompt },
        output_data: null,
        job_status: 'PENDIENTE',
        job_id: jobId
      })

    if (insertError) {
      throw new Error(`Error inserting job: ${insertError.message}`)
    }

    // Invocar función de background de forma asíncrona
    // En Netlify, usar context.awsRequestId.invoke para llamar otra función
    try {
      // Crear evento para la función de background
      const backgroundEvent = {
        httpMethod: 'POST',
        body: JSON.stringify({
          job_id: jobId,
          prompt,
          module_name
        }),
        headers: { 'Content-Type': 'application/json' }
      }

      // Llamar a la función de background (esto se ejecuta después de que esta función termine)
      setTimeout(async () => {
        try {
          await fetch(`${process.env.NETLIFY_URL}/.netlify/functions/genera-evaluacion-background`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: backgroundEvent.body
          })
        } catch (bgError) {
          console.error('Error invoking background function:', bgError)
        }
      }, 100)

    } catch (invokeError) {
      console.error('Error invoking background function:', invokeError)
      // No fallar la función principal, el job sigue pendiente
    }

    // Retornar job_id inmediatamente
    return {
      statusCode: 202,
      headers,
      body: JSON.stringify({
        job_id: jobId,
        message: 'Evaluación iniciada. El proceso es asíncrono.',
        success: true
      })
    }

  } catch (error: any) {
    console.error('Error en start-evaluacion:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}