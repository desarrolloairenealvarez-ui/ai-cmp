import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { FiDownload } from 'react-icons/fi'

export default function ElevarDOK3Page() {
  const { toast } = useToast()
  const [objetivoSimple, setObjetivoSimple] = useState('')
  const [contexto, setContexto] = useState('')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleElevar = async () => {
    if (!objetivoSimple.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el objetivo simple",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/.netlify/functions/elevar-dok3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo_simple: objetivoSimple,
          contexto: contexto,
          module_name: 'elevar-dok3'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setResultado(result.objetivo_dok3)
      toast({
        title: "Objetivo elevado",
        description: "El objetivo ha sido elevado a DOK 3 exitosamente",
      })

    } catch (error) {
      console.error('Error elevating DOK:', error)
      toast({
        title: "Error",
        description: "Error al elevar el objetivo a DOK 3",
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
            <div class="dok3-document">
              <h1>Elevador DOK 3</h1>
              <h2>Objetivo Original:</h2>
              <div>${objetivoSimple}</div>
              ${contexto ? `<h2>Contexto:</h2><div>${contexto}</div>` : ''}
              <h2>Objetivo DOK 3:</h2>
              <div>${resultado}</div>
            </div>
          `,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `objetivo-dok3.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Objetivo exportado a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar el objetivo",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Elevador DOK 3
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transforma objetivos simples a nivel de profundidad DOK 3 (Pensamiento Estratégico) del currículum chileno.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo Simple
          </label>
          <textarea
            value={objetivoSimple}
            onChange={(e) => setObjetivoSimple(e.target.value)}
            placeholder="Ingresa el objetivo de aprendizaje simple que quieres elevar..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contexto Adicional (Opcional)
          </label>
          <textarea
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Proporciona contexto adicional sobre el curso, nivel o contenido..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
        
        <Button 
          onClick={handleElevar}
          disabled={isLoading || !objetivoSimple.trim()}
          className="w-full"
        >
          {isLoading ? 'Elevando...' : 'Elevar a DOK 3'}
        </Button>
      </div>

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Objetivo DOK 3</h2>
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