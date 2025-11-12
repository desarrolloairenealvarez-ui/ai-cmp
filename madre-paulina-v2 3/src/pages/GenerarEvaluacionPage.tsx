import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function GenerarEvaluacionPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [titulo, setTitulo] = useState('')
  const [unidad, setUnidad] = useState('')
  const [objetivos, setObjetivos] = useState('')
  const [tipoEvaluacion, setTipoEvaluacion] = useState('Formativa')
  const [evaluacion, setEvaluacion] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en diseño de evaluaciones educativas.
Genera evaluaciones completas con:
- Instrucciones claras
- Preguntas variadas por nivel DOK
- Puntajes asignados
- Tiempo estimado
Responde en JSON: {"instrucciones": "...", "preguntas": [{"numero": 1, "pregunta": "...", "nivel_dok": "...", "puntaje": X}], "puntaje_total": X, "tiempo_estimado": "..."}`,
    temperature: 0.7,
  })

  async function generarEvaluacion() {
    const prompt = `Genera una evaluación ${tipoEvaluacion} para:
Título: ${titulo}
Unidad: ${unidad}
Objetivos de Aprendizaje: ${objetivos}

Incluye entre 8-12 preguntas con niveles DOK variados (principalmente DOK 2-3).`

    const response = await callAI(prompt)

    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setEvaluacion(parsed)

        if (user) {
          await supabase.from('evaluaciones_generadas').insert({
            user_id: user.id,
            tipo_evaluacion: tipoEvaluacion,
            contenido_evaluacion: parsed,
          })
        }
      } catch (e) {
        setEvaluacion({ error: 'Formato no válido', raw: response })
      }
    }
  }

  async function exportPDF() {
    const preguntasHTML = evaluacion?.preguntas?.map((p: any) => `
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; color: #2b5774;">
          ${p.numero}. ${p.pregunta} (${p.puntaje} pts | ${p.nivel_dok})
        </p>
        <div style="border-bottom: 1px solid #ddd; margin-top: 30px; margin-bottom: 10px;"></div>
      </div>
    `).join('') || ''

    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2b5774; margin-bottom: 5px;">${titulo}</h1>
          <p style="color: #666;">${unidad} | Evaluación ${tipoEvaluacion}</p>
          <p style="font-size: 14px; color: #888;">
            Puntaje Total: ${evaluacion?.puntaje_total} pts | Tiempo: ${evaluacion?.tiempo_estimado}
          </p>
        </div>
        <hr style="border: 2px solid #4a95bf; margin: 20px 0;" />
        
        <div style="background: #f0f7ff; padding: 15px; margin-bottom: 25px; border-left: 4px solid #4a95bf;">
          <h3 style="color: #2b5774; margin-bottom: 10px;">Instrucciones:</h3>
          <p style="margin: 0;">${evaluacion?.instrucciones}</p>
        </div>
        
        ${preguntasHTML}
      </div>
    `
    html2pdf().from(element).save(`evaluacion-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-cmp-azul-oscuro">Genera Evaluación</h1>
          </div>
          {evaluacion && (
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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Generador de Evaluaciones</CardTitle>
                <CardDescription>
                  Crea evaluaciones completas con preguntas calibradas por DOK
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la Evaluación</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Evaluación Unidad 2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={tipoEvaluacion}
                  onChange={(e) => setTipoEvaluacion(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option>Formativa</option>
                  <option>Sumativa</option>
                  <option>Diagnóstica</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unidad / Eje Temático</label>
              <Input
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                placeholder="Ej: Narrativa Latinoamericana"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivos de Aprendizaje</label>
              <Textarea
                value={objetivos}
                onChange={(e) => setObjetivos(e.target.value)}
                placeholder="Describe los objetivos que la evaluación debe medir..."
                className="min-h-[120px]"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={generarEvaluacion}
              disabled={!titulo || !objetivos || loading}
              className="w-full bg-cmp-azul-oscuro hover:bg-cmp-azul-sombra"
            >
              {loading ? 'Generando Evaluación...' : 'Generar Evaluación'}
            </Button>

            {evaluacion && !evaluacion.error && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-azul-oscuro">Evaluación Generada</h3>

                <div className="p-4 bg-blue-50 border-l-4 border-cmp-azul-medio rounded">
                  <h4 className="font-semibold mb-2">Instrucciones</h4>
                  <p className="text-sm text-gray-700">{evaluacion.instrucciones}</p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span><strong>Puntaje Total:</strong> {evaluacion.puntaje_total} pts</span>
                    <span><strong>Tiempo:</strong> {evaluacion.tiempo_estimado}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {evaluacion.preguntas?.map((p: any) => (
                    <div key={p.numero} className="p-4 bg-white border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-cmp-azul-oscuro">Pregunta {p.numero}</h4>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-cmp-azul-medio text-white px-2 py-1 rounded">{p.nivel_dok}</span>
                          <span className="bg-cmp-naranja text-white px-2 py-1 rounded">{p.puntaje} pts</span>
                        </div>
                      </div>
                      <p className="text-gray-900">{p.pregunta}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
