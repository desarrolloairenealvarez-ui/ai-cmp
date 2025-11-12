import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function PreguntasOAPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [objetivoAprendizaje, setObjetivoAprendizaje] = useState('')
  const [asignatura, setAsignatura] = useState('')
  const [nivel, setNivel] = useState('')
  const [cantidad, setCantidad] = useState('5')
  const [preguntas, setPreguntas] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en diseño curricular y evaluación por objetivos de aprendizaje.
Genera preguntas variadas (DOK 1-4) alineadas al objetivo proporcionado.
Responde en JSON: {"preguntas": [{"pregunta": "...", "nivel_dok": "DOK X", "justificacion": "..."}]}`,
    temperature: 0.7,
  })

  async function generarPreguntas() {
    const prompt = `Genera ${cantidad} preguntas de evaluación para:
Asignatura: ${asignatura}
Nivel: ${nivel}
Objetivo de Aprendizaje: ${objetivoAprendizaje}

Incluye preguntas de diferentes niveles DOK (1-4) y justifica cada una.`

    const response = await callAI(prompt)

    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setPreguntas(parsed)

        if (user) {
          await supabase.from('preguntas_oa').insert({
            user_id: user.id,
            objetivo_aprendizaje: objetivoAprendizaje,
            asignatura,
            nivel,
            preguntas_generadas: parsed,
          })
        }
      } catch (e) {
        setPreguntas({ error: 'Formato no válido', raw: response })
      }
    }
  }

  async function exportPDF() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774;">Preguntas por Objetivo de Aprendizaje</h1>
        <p><strong>Asignatura:</strong> ${asignatura} | <strong>Nivel:</strong> ${nivel}</p>
        <p><strong>Objetivo:</strong> ${objetivoAprendizaje}</p>
        <hr style="border: 1px solid #4a95bf; margin: 20px 0;" />
        
        ${preguntas?.preguntas
          ?.map(
            (p: any, i: number) => `
          <div style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-left: 4px solid #78aa47;">
            <h3 style="color: #4b722d; margin-bottom: 10px;">Pregunta ${i + 1} - ${p.nivel_dok}</h3>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>${p.pregunta}</strong></p>
            <p style="font-size: 14px; color: #666;"><em>Justificación:</em> ${p.justificacion}</p>
          </div>
        `
          )
          .join('') || ''}
      </div>
    `
    html2pdf().from(element).save(`preguntas-oa-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-cmp-verde-claro">Preguntas por OA</h1>
          </div>
          {preguntas && (
            <Button onClick={exportPDF} variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cmp-verde-claro rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Generador de Preguntas por Objetivo</CardTitle>
                <CardDescription>
                  Crea preguntas alineadas a objetivos de aprendizaje específicos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Input
                  value={asignatura}
                  onChange={(e) => setAsignatura(e.target.value)}
                  placeholder="Ej: Lenguaje y Comunicación"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nivel Educativo</label>
                <Input
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  placeholder="Ej: 7° Básico"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivo de Aprendizaje</label>
              <Textarea
                value={objetivoAprendizaje}
                onChange={(e) => setObjetivoAprendizaje(e.target.value)}
                placeholder="Ej: Analizar textos narrativos, considerando narrador, personajes, conflicto..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cantidad de Preguntas</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={generarPreguntas}
              disabled={!objetivoAprendizaje || !asignatura || loading}
              className="w-full bg-cmp-verde-claro hover:bg-cmp-verde-oscuro"
            >
              {loading ? 'Generando...' : 'Generar Preguntas'}
            </Button>

            {preguntas && !preguntas.error && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-verde-oscuro">
                  Preguntas Generadas
                </h3>
                {preguntas.preguntas?.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 bg-green-50 border-l-4 border-cmp-verde-claro rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-cmp-verde-oscuro">
                        Pregunta {idx + 1}
                      </h4>
                      <span className="text-xs bg-cmp-verde-oscuro text-white px-2 py-1 rounded">
                        {p.nivel_dok}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{p.pregunta}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Justificación:</strong> {p.justificacion}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
