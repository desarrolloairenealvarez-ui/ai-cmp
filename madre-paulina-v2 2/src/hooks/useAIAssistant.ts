import { useState } from 'react'

interface UseAIAssistantOptions {
  endpoint?: string
  systemPrompt?: string
  temperature?: number
}

interface AIResponse {
  response: string
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

export function useAIAssistant(options: UseAIAssistantOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callAI = async (prompt: string): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      // Llamar a Netlify Function
      const response = await fetch('/.netlify/functions/gemini-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: options.systemPrompt,
          temperature: options.temperature || 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data: { success: boolean; response?: string; error?: string } =
        await response.json()

      if (!data.success || !data.response) {
        throw new Error(data.error || 'Error al obtener respuesta de IA')
      }

      return data.response
    } catch (err: any) {
      const errorMessage = err.message || 'Error al conectar con IA'
      setError(errorMessage)
      console.error('Error en useAIAssistant:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { callAI, loading, error }
}
