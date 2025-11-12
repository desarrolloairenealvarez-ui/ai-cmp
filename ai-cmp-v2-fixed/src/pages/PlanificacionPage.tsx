import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function PlanificacionPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [titulo, setTitulo] = useState('')
  const [asignatura, setAsignatura] = useState('')
  const [nivel, setNivel] = useState('')
  const [duracion, setDuracion] = useState('')
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState('')
  const [planificacion, setPlanificacion] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en planificación didáctica y diseño instruccional.
Genera planificaciones de secuencia didáctica basadas en los 7 pasos del aprendizaje profundo:
1. Activación de conocimientos previos
2. Presentación de contenidos
3. Práctica guiada
4. Práctica independiente
5. Retroalimentación
6. Evaluación
7. Cierre y transferencia

Responde en JSON: {"titulo": "...", "objetivo": "...", "secuencia": [{"paso": 1, "nombre": "...", "actividades": "...", "tiempo": "..."}], "recursos": [...], "evaluacion": "..."}`,
    temperature: 0.7,
  })

  async function generarPlanificacion() {
    const prompt = `Genera una planificación de secuencia didáctica para:
Título: ${titulo}
Asignatura: ${asignatura}
Nivel: ${nivel}
Duración: ${duracion} clases
Objetivo de Aprendizaje: ${objetivoAprendizaje}

Incluye los 7 pasos del aprendizaje profundo con actividades específicas para cada paso.`

    const response = await callAI(prompt)

    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setPlanificacion(parsed)

        if (user) {
          await supabase.from('planificaciones').insert({
            user_id: user.id,
            titulo,
            nivel,
            asignatura,
            objetivos: objetivoAprendizaje,
            contenido_generado: parsed,
          })
        }
      } catch (e) {
        setPlanificacion({ error: 'Formato no válido', raw: response })
      }
    }
  }

  async function exportPDF() {
    const secuenciaHTML = planificacion?.secuencia?.map((s: any) => `
      <div style="margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-left: 5px solid #4a95bf;">
        <h3 style="color: #2b5774; margin-bottom: 10px;">
          Paso ${s.paso}: ${s.nombre}
        </h3>
        <p style="margin-bottom: 8px;"><strong>Actividades:</strong></p>
        <p style="margin-bottom: 8px;">${s.actividades}</p>
        <p style="color: #666; font-size: 14px;"><strong>Tiempo estimado:</strong> ${s.tiempo}</p>
      </div>
    `).join('') || ''

    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2b5774;">${titulo}</h1>
          <p style="color: #666;">${asignatura} | ${nivel} | ${duracion} clases</p>
        </div>
        <hr style="border: 2px solid #4a95bf; margin: 20px 0;" />
        
        <div style="background: #f0f7ff; padding: 20px; margin-bottom: 30px; border-left: 4px solid #4a95bf;">
          <h3 style="color: #2b5774; margin-bottom: 10px;">Objetivo de Aprendizaje:</h3>
          <p style="margin: 0;">${planificacion?.objetivo || objetivoAprendizaje}</p>
        </div>
        
        <h2 style="color: #2b5774; margin-bottom: 20px;">Secuencia Didáctica (7 Pasos):</h2>
        ${secuenciaHTML}
        
        ${planificacion?.recursos ? `
          <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-left: 4px solid #f4aa3e;">
            <h3 style="color: #856404; margin-bottom: 10px;">Recursos Necesarios:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${planificacion.recursos.map((r: string) => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${planificacion?.evaluacion ? `
          <div style="margin-top: 20px; padding: 20px; background: #d4edda; border-left: 4px solid #78aa47;">
            <h3 style="color: #4b722d; margin-bottom: 10px;">Evaluación:</h3>
            <p style="margin: 0;">${planificacion.evaluacion}</p>
          </div>
        ` : ''}
      </div>
    `
    html2pdf().from(element).save(`planificacion-${Date.now()}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-cmp-azul-oscuro">Planificador Secuencia</h1>
          </div>
          {planificacion && (
            <Button onClick={exportPDF} variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cmp-azul-oscuro rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Planificador de Secuencia Didáctica</CardTitle>
                <CardDescription>
                  Genera planificaciones basadas en los 7 pasos del aprendizaje profundo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la Unidad</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: La Narrativa Contemporánea"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Input
                  value={asignatura}
                  onChange={(e) => setAsignatura(e.target.value)}
                  placeholder="Ej: Lenguaje y Comunicación"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nivel Educativo</label>
                <Input
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  placeholder="Ej: 1° Medio"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración (clases)</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="Ej: 8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivo de Aprendizaje</label>
              <Textarea
                value={objetivoAprendizaje}
                onChange={(e) => setObjetivoAprendizaje(e.target.value)}
                placeholder="Describe el objetivo principal que los estudiantes deben alcanzar..."
                className="min-h-[120px]"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={generarPlanificacion}
              disabled={!titulo || !objetivoAprendizaje || loading}
              className="w-full bg-cmp-azul-oscuro hover:bg-cmp-azul-sombra"
            >
              {loading ? 'Generando Planificación...' : 'Generar Planificación'}
            </Button>

            {planificacion && !planificacion.error && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-azul-oscuro">
                  Planificación Generada
                </h3>

                <div className="p-4 bg-blue-50 border-l-4 border-cmp-azul-medio rounded">
                  <h4 className="font-semibold mb-2">Objetivo</h4>
                  <p className="text-sm text-gray-700">{planificacion.objetivo}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-cmp-azul-oscuro">
                    Secuencia Didáctica (7 Pasos):
                  </h4>
                  {planificacion.secuencia?.map((paso: any) => (
                    <div key={paso.paso} className="p-4 bg-gray-50 border-l-4 border-cmp-azul-medio rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-cmp-azul-oscuro">
                          Paso {paso.paso}: {paso.nombre}
                        </h5>
                        <span className="text-xs bg-cmp-naranja text-white px-2 py-1 rounded">
                          {paso.tiempo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{paso.actividades}</p>
                    </div>
                  ))}
                </div>

                {planificacion.recursos && (
                  <div className="p-4 bg-amber-50 border-l-4 border-cmp-naranja rounded">
                    <h4 className="font-semibold mb-2 text-cmp-naranja">Recursos Necesarios</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {planificacion.recursos.map((recurso: string, idx: number) => (
                        <li key={idx}>{recurso}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {planificacion.evaluacion && (
                  <div className="p-4 bg-green-50 border-l-4 border-success rounded">
                    <h4 className="font-semibold mb-2 text-success">Evaluación</h4>
                    <p className="text-sm text-gray-700">{planificacion.evaluacion}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
