import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { supabase } from '@/App'
import { useToast } from '@/components/ui/use-toast'
import { FiSave, FiDownload } from 'react-icons/fi'

interface PlanificacionData {
  titulo: string
  expectativaMeta: string
  nivelesLogro: string
  modelamientoExperto: string
  ejercitacionGuiada: string
  practicaIndividual: string
  retroalimentacion: string
  desafioExtension: string
}

export default function PlanificadorPage() {
  const { toast } = useToast()
  const [planificacion, setPlanificacion] = useState<PlanificacionData>({
    titulo: '',
    expectativaMeta: '',
    nivelesLogro: '',
    modelamientoExperto: '',
    ejercitacionGuiada: '',
    practicaIndividual: '',
    retroalimentacion: '',
    desafioExtension: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const modules = [
    { name: 'Expectativa y Meta Clara', key: 'expectativaMeta' as keyof PlanificacionData },
    { name: 'Descripción de Niveles de Logro', key: 'nivelesLogro' as keyof PlanificacionData },
    { name: 'Modelamiento Experto', key: 'modelamientoExperto' as keyof PlanificacionData },
    { name: 'Ejercitación Conjunta y Guiada', key: 'ejercitacionGuiada' as keyof PlanificacionData },
    { name: 'Práctica Individual Deliberada', key: 'practicaIndividual' as keyof PlanificacionData },
    { name: 'Retroalimentación Formativa y Específica', key: 'retroalimentacion' as keyof PlanificacionData },
    { name: 'Desafío de Extensión', key: 'desafioExtension' as keyof PlanificacionData },
  ]

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  }

  const handleSave = async () => {
    if (!planificacion.titulo.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un título para la planificación",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      const { data, error } = await supabase
        .from('planificaciones')
        .insert({
          user_id: user.id,
          titulo: planificacion.titulo,
          expectativa_meta: planificacion.expectativaMeta,
          niveles_logro: planificacion.nivelesLogro,
          modelamiento_experto: planificacion.modelamientoExperto,
          ejercitacion_guiada: planificacion.ejercitacionGuiada,
          practica_individual: planificacion.practicaIndividual,
          retroalimentacion: planificacion.retroalimentacion,
          desafio_extension: planificacion.desafioExtension
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Éxito",
        description: "Planificación guardada correctamente",
      })

    } catch (error) {
      console.error('Error saving planificación:', error)
      toast({
        title: "Error",
        description: "Error al guardar la planificación",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerarEvaluacion = async () => {
    setIsLoading(true)
    try {
      // Llamar a la función start-evaluacion
      const response = await fetch('/.netlify/functions/start-evaluacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generar una evaluación basada en la siguiente planificación docente:

Título: ${planificacion.titulo}

Expectativa y Meta Clara: ${planificacion.expectativaMeta}

Descripción de Niveles de Logro: ${planificacion.nivelesLogro}

Modelamiento Experto: ${planificacion.modelamientoExperto}

Ejercitación Conjunta y Guiada: ${planificacion.ejercitacionGuiada}

Práctica Individual Deliberada: ${planificacion.practicaIndividual}

Retroalimentación Formativa y Específica: ${planificacion.retroalimentacion}

Desafío de Extensión: ${planificacion.desafioExtension}`,
          module_name: 'generar-evaluacion'
        }),
      })

      const result = await response.json()
      
      if (result.job_id) {
        toast({
          title: "Evaluación iniciada",
          description: "La evaluación se está generando. Recibirás una notificación cuando esté lista.",
        })
        
        // Polling para verificar el estado
        const checkStatus = async () => {
          const statusResponse = await fetch(`/.netlify/functions/check-evaluacion-status?job_id=${result.job_id}`)
          const statusResult = await statusResponse.json()
          
          if (statusResult.job_status === 'COMPLETADO') {
            toast({
              title: "Evaluación lista",
              description: "Tu evaluación está lista para descargar",
            })
          } else {
            // Continuar verificando cada 5 segundos
            setTimeout(checkStatus, 5000)
          }
        }
        
        setTimeout(checkStatus, 5000)
      }

    } catch (error) {
      console.error('Error generating evaluation:', error)
      toast({
        title: "Error",
        description: "Error al generar la evaluación",
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
          htmlContent: generateHTMLContent(),
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `planificacion-${planificacion.titulo.replace(/\s+/g, '-').toLowerCase()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportado",
        description: `Planificación exportada a ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Error exporting:', error)
      toast({
        title: "Error",
        description: "Error al exportar la planificación",
        variant: "destructive",
      })
    }
  }

  const generateHTMLContent = () => {
    return `
      <div class="planning-document">
        <h1>${planificacion.titulo}</h1>
        <h2>Expectativa y Meta Clara</h2>
        <div>${planificacion.expectativaMeta}</div>
        <h2>Descripción de Niveles de Logro</h2>
        <div>${planificacion.nivelesLogro}</div>
        <h2>Modelamiento Experto</h2>
        <div>${planificacion.modelamientoExperto}</div>
        <h2>Ejercitación Conjunta y Guiada</h2>
        <div>${planificacion.ejercitacionGuiada}</div>
        <h2>Práctica Individual Deliberada</h2>
        <div>${planificacion.practicaIndividual}</div>
        <h2>Retroalimentación Formativa y Específica</h2>
        <div>${planificacion.retroalimentacion}</div>
        <h2>Desafío de Extensión</h2>
        <div>${planificacion.desafioExtension}</div>
      </div>
    `
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Planificador de Secuencia Didáctica
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Herramienta para crear secuencias didácticas profundas basadas en los 7 pasos para el aprendizaje profundo del Colegio Madre Paulina.
        </p>
      </div>

      {/* Title input */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título de la Planificación
        </label>
        <Input
          value={planificacion.titulo}
          onChange={(e) => setPlanificacion({ ...planificacion, titulo: e.target.value })}
          placeholder="Ingresa el título de tu planificación..."
        />
      </div>

      {/* 7 Steps */}
      <div className="space-y-6">
        {modules.map((module, index) => (
          <div key={module.key} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {module.name}
              </h2>
            </div>
            <ReactQuill
              theme="snow"
              value={planificacion[module.key]}
              onChange={(value) => setPlanificacion({ ...planificacion, [module.key]: value })}
              modules={quillModules}
              placeholder={`Describe los detalles para ${module.name.toLowerCase()}...`}
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <FiSave className="h-4 w-4" />
            {isSaving ? 'Guardando...' : 'Guardar Planificación'}
          </Button>
          
          <Button 
            onClick={handleGenerarEvaluacion}
            disabled={isLoading || !planificacion.titulo.trim()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiDownload className="h-4 w-4" />
            {isLoading ? 'Generando...' : 'Generar Evaluación'}
          </Button>

          <Button 
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiDownload className="h-4 w-4" />
            Exportar a PDF
          </Button>

          <Button 
            onClick={() => handleExport('docx')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiDownload className="h-4 w-4" />
            Exportar a DOCX
          </Button>
        </div>
      </div>
    </div>
  )
}