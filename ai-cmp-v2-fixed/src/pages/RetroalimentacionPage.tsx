import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function RetroalimentacionPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [respuestaEstudiante, setRespuestaEstudiante] = useState('')
  const [respuestaEsperada, setRespuestaEsperada] = useState('')
  const [contexto, setContexto] = useState('')
  const [feedback, setFeedback] = useState('')
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en retroalimentación formativa según principios de John Hattie.
Proporciona feedback constructivo que:
1. Reconozca aciertos del estudiante
2. Identifique áreas de mejora específicas
3. Ofrezca pasos concretos para avanzar
4. Use lenguaje motivador y constructivo
5. Sea específico y accionable`,
    temperature: 0.7,
  })

  async function generarFeedback() {
    const prompt = `Genera retroalimentación formativa para:

CONTEXTO: ${contexto}

RESPUESTA ESPERADA:
${respuestaEsperada}

RESPUESTA DEL ESTUDIANTE:
${respuestaEstudiante}

Proporciona feedback constructivo en formato de párrafo directo al estudiante.`

    const response = await callAI(prompt)

    if (response) {
      setFeedback(response)

      if (user) {
        await supabase.from('retroalimentaciones').insert({
          user_id: user.id,
          respuesta_estudiante: respuestaEstudiante,
          respuesta_esperada: respuestaEsperada,
          feedback_generado: response,
        })
      }
    }
  }

  async function exportPDF() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #78aa47;">Retroalimentación Formativa</h1>
        <p style="color: #666;">Generado: ${new Date().toLocaleString('es-CL')}</p>
        <hr style="border: 1px solid #78aa47; margin: 20px 0;" />
        
        <h2 style="color: #4b722d;">Contexto:</h2>
        <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #78aa47;">${contexto}</p>
        
        <h2 style="color: #4b722d; margin-top: 20px;">Respuesta Esperada:</h2>
        <p style="background: #f0f7ff; padding: 15px;">${respuestaEsperada}</p>
        
        <h2 style="color: #4b722d; margin-top: 20px;">Respuesta del Estudiante:</h2>
        <p style="background: #fff3cd; padding: 15px;">${respuestaEstudiante}</p>
        
        <h2 style="color: #4b722d; margin-top: 20px;">Retroalimentación:</h2>
        <p style="background: #d4edda; padding: 20px; border: 2px solid #78aa47; border-radius: 5px;">
          ${feedback}
        </p>
      </div>
    `
    html2pdf().from(element).save(`feedback-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-success">Retroalimentación</h1>
          </div>
          {feedback && (
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
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Asistente de Retroalimentación</CardTitle>
                <CardDescription>
                  Genera feedback constructivo y formativo para estudiantes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contexto de la Evaluación</label>
              <Textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Ej: Evaluación de comprensión lectora sobre el texto 'El Principito'"
                className="min-h-[60px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Respuesta Esperada (Pauta)</label>
              <Textarea
                value={respuestaEsperada}
                onChange={(e) => setRespuestaEsperada(e.target.value)}
                placeholder="Describe lo que se esperaba que el estudiante respondiera..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Respuesta del Estudiante</label>
              <Textarea
                value={respuestaEstudiante}
                onChange={(e) => setRespuestaEstudiante(e.target.value)}
                placeholder="Copia aquí la respuesta que dio el estudiante..."
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={generarFeedback}
              disabled={!respuestaEstudiante || !respuestaEsperada || loading}
              className="w-full bg-success hover:bg-cmp-verde-oscuro"
            >
              {loading ? 'Generando Feedback...' : 'Generar Retroalimentación'}
            </Button>

            {feedback && (
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-success mb-4">
                  Retroalimentación Generada
                </h3>
                <div className="p-6 bg-green-50 border-2 border-success rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {feedback}
                  </p>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">
                    <strong>Sugerencia:</strong> Personaliza esta retroalimentación según el
                    contexto específico de tu estudiante antes de entregarla.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
