import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { FiDownload } from 'react-icons/fi'

export default function GenerarPreguntasOAPage() {
  const { toast } = useToast()
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState('')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerar = async () => {
    if (!objetivoAprendizaje.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el objetivo de aprendizaje",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/.netlify/functions/generar-preguntas-oa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo_aprendizaje: objetivoAprendizaje,
          module_name: 'generar-preguntas-oa'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setResultado(result.preguntas)
      toast({
        title: "Preguntas generadas",
        description: "Las preguntas han sido creadas exitosamente",
      })

    } catch (error) {
      console.error('Error generating questions:', error)
      toast({
        title: "Error",
        description: "Error al generar las preguntas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <div class="questions-document">
              <h1>Generador de Preguntas por Objetivos de Aprendizaje</h1>
              <h2>Objetivo de Aprendizaje:</h2>
              <div>${objetivoAprendizaje}</div>
              <h2>Preguntas Generadas:</h2>
              <div>${resultado}</div>
            </div>
          `,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `preguntas-oa.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Preguntas exportadas a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar las preguntas",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Generador de Preguntas por Objetivos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Genera preguntas de evaluación alineadas con los Objetivos de Aprendizaje del currículum chileno.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objetivo de Aprendizaje
        </label>
        <textarea
          value={objetivoAprendizaje}
          onChange={(e) => setObjetivoAprendizaje(e.target.value)}
          placeholder="Ingresa el objetivo de aprendizaje específico del currículum chileno..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <Button 
          onClick={handleGenerar}
          disabled={isLoading || !objetivoAprendizaje.trim()}
          className="mt-4 w-full"
        >
          {isLoading ? 'Generando...' : 'Generar Preguntas'}
        </Button>
      </div>

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preguntas Generadas</h2>
            <div className="flex gap-2">
              <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
                <FiDownload className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button onClick={() => handleExport('docx')} variant="outline" size="sm">
                <FiDownload className="h-4 w-4 mr-1" />
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