import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { FiDownload } from 'react-icons/fi'

export default function GenerarRubricaPage() {
  const { toast } = useToast()
  const [asignatura, setAsignatura] = useState('')
  const [criterios, setCriterios] = useState('')
  const [niveles, setNiveles] = useState('4')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerar = async () => {
    if (!asignatura.trim() || !criterios.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/.netlify/functions/generar-rubrica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asignatura,
          criterios,
          niveles,
          module_name: 'generar-rubrica'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setResultado(result.rubrica)
      toast({
        title: "Rúbrica generada",
        description: "La rúbrica ha sido creada exitosamente",
      })

    } catch (error) {
      console.error('Error generating rubric:', error)
      toast({
        title: "Error",
        description: "Error al generar la rúbrica",
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
            <div class="rubric-document">
              <h1>Rúbrica de Evaluación - ${asignatura}</h1>
              <h2>Criterios:</h2>
              <div>${criterios}</div>
              <h2>Rúbrica:</h2>
              <div>${resultado}</div>
            </div>
          `,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rubrica-${asignatura.replace(/\s+/g, '-').toLowerCase()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Rúbrica exportada a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar la rúbrica",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Generador de Rúbricas
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Crea rúbricas de evaluación personalizadas para tus asignaturas del currículum chileno.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asignatura
          </label>
          <Input
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
            placeholder="Ej: Historia, Geografía y Ciencias Sociales"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Criterios de Evaluación
          </label>
          <textarea
            value={criterios}
            onChange={(e) => setCriterios(e.target.value)}
            placeholder="Describe los criterios que quieres evaluar..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Niveles de Desempeño
          </label>
          <select
            value={niveles}
            onChange={(e) => setNiveles(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3">3 niveles</option>
            <option value="4">4 niveles</option>
            <option value="5">5 niveles</option>
          </select>
        </div>
        
        <Button 
          onClick={handleGenerar}
          disabled={isLoading || !asignatura.trim() || !criterios.trim()}
          className="w-full"
        >
          {isLoading ? 'Generando...' : 'Generar Rúbrica'}
        </Button>
      </div>

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rúbrica Generada</h2>
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