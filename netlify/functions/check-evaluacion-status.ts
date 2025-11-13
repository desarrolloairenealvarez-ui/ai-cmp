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
    const { prompt, module_name } = JSON.parse(event.body)
    
    if (!prompt) {
      throw new Error('Prompt requerido')
    }

    // Extraer job_id de los parámetros de URL o del body
    const url = new URL(event.rawUrl || `https://${event.headers.host}${event.path}`)
    const jobId = url.searchParams.get('job_id') || JSON.parse(event.body).job_id

    if (!jobId) {
      throw new Error('job_id requerido para verificar estado')
    }

    // Aquí deberías consultar Supabase para obtener el estado del job
    // Por simplicidad, simulamos la consulta
    const mockResponse = {
      job_status: 'COMPLETADO',
      output_data: { evaluacion: 'Evaluación completada exitosamente' }
    }

    // En implementación real, aquí harías:
    // const { data, error } = await supabase
    //   .from('user_work_history')
    //   .select('job_status, output_data')
    //   .eq('job_id', jobId)
    //   .single()

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResponse)
    }

  } catch (error: any) {
    console.error('Error checking evaluation status:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}