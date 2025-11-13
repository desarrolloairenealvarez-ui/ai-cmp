import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/App'
import { useToast } from '@/components/ui/use-toast'
import { FiFileDown, FiClock } from 'react-icons/fi'

export default function GenerarEvaluacionPage() {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState('')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  const handleGenerar = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el prompt para la evaluación",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Llamar a la función start-evaluacion
      const response = await fetch('/.netlify/functions/start-evaluacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          module_name: 'generar-evaluacion'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setJobId(result.job_id)
      toast({
        title: "Evaluación iniciada",
        description: "La evaluación se está generando. Recibirás una notificación cuando esté lista.",
      })

      // Empezar polling
      setIsPolling(true)
      startPolling(result.job_id)

    } catch (error) {
      console.error('Error starting evaluation:', error)
      toast({
        title: "Error",
        description: "Error al iniciar la generación de evaluación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = async (jobId: string) => {
    try {
      const response = await fetch(`/check-evaluacion-status?job_id=${jobId}`)
      const result = await response.json()

      if (result.job_status === 'COMPLETADO') {
        setResultado(result.output_data)
        setIsPolling(false)
        toast({
          title: "Evaluación lista",
          description: "Tu evaluación está lista para descargar",
        })
      } else {
        // Continuar verificando cada 5 segundos
        setTimeout(() => startPolling(jobId), 5000)
      }
    } catch (error) {
      console.error('Error checking status:', error)
      setIsPolling(false)
      toast({
        title: "Error",
        description: "Error al verificar el estado de la evaluación",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const response = await fetch(`/.netlify/functions/export-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: `
            <div class="evaluation-document">
              <h1>Generador de Evaluaciones</h1>
              <h2>Prompt Ingresado:</h2>
              <div>${prompt}</div>
              <h2>Evaluación Generada:</h2>
              <div>${resultado}</div>
            </div>
          `,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evaluacion-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Evaluación exportada a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar la evaluación",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Generador de Evaluaciones
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Crea evaluaciones completas con múltiples tipos de preguntas utilizando IA. Este proceso puede tardar varios minutos.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt para la Evaluación
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe qué tipo de evaluación necesitas, qué temas debe cubrir, qué niveles, etc..."
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <Button 
          onClick={handleGenerar}
          disabled={isLoading || !prompt.trim()}
          className="mt-4 w-full"
        >
          {isLoading ? 'Iniciando Generación...' : 'Generar Evaluación'}
        </Button>
      </div>

      {isPolling && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FiClock className="h-5 w-5 text-blue-500 animate-spin" />
            <div>
              <p className="text-blue-800 font-medium">Evaluación en proceso...</p>
              <p className="text-blue-600 text-sm">Esto puede tardar varios minutos. Te notificaremos cuando esté lista.</p>
            </div>
          </div>
        </div>
      )}

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Evaluación Generada</h2>
            <div className="flex gap-2">
              <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
                <FiFileDown className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button onClick={() => handleExport('docx')} variant="outline" size="sm">
                <FiFileDown className="h-4 w-4 mr-1" />
                DOCX
              </Button>
            </div>
          </div>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: resultado }} />
          </div>
        </div>
      )}
    </div>
  )
}