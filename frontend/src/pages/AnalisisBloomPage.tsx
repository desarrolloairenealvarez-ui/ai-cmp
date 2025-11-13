import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/App'
import { useToast } from '@/components/ui/use-toast'
import { FiFileDown } from 'react-icons/fi'

export default function AnalisisBloomPage() {
  const { toast } = useToast()
  const [objetivos, setObjetivos] = useState('')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalizar = async () => {
    if (!objetivos.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa los objetivos de aprendizaje",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/.netlify/functions/analisis-bloom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivos,
          module_name: 'analisis-bloom'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setResultado(result.analisis)
      toast({
        title: "Análisis completado",
        description: "El análisis de Bloom ha sido generado exitosamente",
      })

    } catch (error) {
      console.error('Error analyzing Bloom:', error)
      toast({
        title: "Error",
        description: "Error al analizar los objetivos de Bloom",
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
            <div class="analysis-document">
              <h1>Análisis de Taxonomía de Bloom</h1>
              <h2>Objetivos de Aprendizaje Ingresados:</h2>
              <div>${objetivos}</div>
              <h2>Análisis:</h2>
              <div>${resultado}</div>
            </div>
          `,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analisis-bloom.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Análisis exportado a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar el análisis",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Análisis de Taxonomía de Bloom
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Evalúa el nivel de pensamiento crítico en tus objetivos de aprendizaje según la taxonomía de Bloom.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objetivos de Aprendizaje
        </label>
        <textarea
          value={objetivos}
          onChange={(e) => setObjetivos(e.target.value)}
          placeholder="Ingresa tus objetivos de aprendizaje, uno por línea..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <Button 
          onClick={handleAnalizar}
          disabled={isLoading || !objetivos.trim()}
          className="mt-4 w-full"
        >
          {isLoading ? 'Analizando...' : 'Analizar Objetivos'}
        </Button>
      </div>

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resultado del Análisis</h2>
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