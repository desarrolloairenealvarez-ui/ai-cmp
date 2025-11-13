import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { FiDownload } from 'react-icons/fi'

export default function AnalisisBalancePage() {
  const { toast } = useToast()
  const [pruebaCompleta, setPruebaCompleta] = useState('')
  const [resultado, setResultado] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalizar = async () => {
    if (!pruebaCompleta.trim()) {
      toast({
        title: "Error",
        description: "Por favor pega la prueba completa",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/.netlify/functions/analisis-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prueba_completa: pruebaCompleta,
          module_name: 'analisis-balance'
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setResultado(result.analisis)
      toast({
        title: "Análisis completado",
        description: "El análisis de balance curricular ha sido generado",
      })

    } catch (error) {
      console.error('Error analyzing balance:', error)
      toast({
        title: "Error",
        description: "Error al analizar el balance curricular",
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
            <div class="balance-document">
              <h1>Análisis de Balance Curricular</h1>
              <h2>Prueba Analizada:</h2>
              <div>${pruebaCompleta}</div>
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
      a.download = `analisis-balance.${format}`
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
          Análisis de Balance Curricular
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Verifica la distribución equilibrada del contenido curricular en tus pruebas y evaluaciones.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prueba Completa
        </label>
        <textarea
          value={pruebaCompleta}
          onChange={(e) => setPruebaCompleta(e.target.value)}
          placeholder="Pega aquí el contenido completo de tu prueba o evaluación..."
          className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <Button 
          onClick={handleAnalizar}
          disabled={isLoading || !pruebaCompleta.trim()}
          className="mt-4 w-full"
        >
          {isLoading ? 'Analizando...' : 'Analizar Balance Curricular'}
        </Button>
      </div>

      {resultado && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Análisis de Balance</h2>
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