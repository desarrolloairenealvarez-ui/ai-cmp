import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileSearch, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function AnalizarReactivoPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [reactivo, setReactivo] = useState('')
  const [analisis, setAnalisis] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en taxonomía de Bloom y niveles DOK (Depth of Knowledge).
Analiza el reactivo proporcionado y responde en formato JSON:
{
  "bloom": {"nivel": "...", "justificacion": "..."},
  "dok": {"nivel": "DOK 1|2|3|4", "justificacion": "..."},
  "recomendaciones": "..."
}`,
    temperature: 0.5,
  })

  async function handleAnalizar() {
    const prompt = `Analiza este reactivo educativo:\n\n"${reactivo}"\n\nProporciona análisis completo en JSON.`
    const response = await callAI(prompt)
    
    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setAnalisis(parsed)
        
        if (user) {
          await supabase.from('reactivos_analizados').insert({
            user_id: user.id,
            reactivo_texto: reactivo,
            nivel_bloom: parsed.bloom?.nivel,
            nivel_dok: parsed.dok?.nivel,
            analisis_completo: parsed,
          })
        }
      } catch (e) {
        setAnalisis({ error: 'No se pudo analizar el formato de respuesta', raw: response })
      }
    }
  }

  async function exportPDF() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774;">Análisis de Reactivo - Bloom & DOK</h1>
        <p style="color: #666;">Generado: ${new Date().toLocaleString('es-CL')}</p>
        <hr style="border: 1px solid #4a95bf; margin: 20px 0;" />
        <h3>Reactivo Analizado:</h3>
        <p style="background: #f0f7ff; padding: 15px; border-left: 4px solid #4a95bf;">${reactivo}</p>
        <h3>Nivel Bloom:</h3>
        <p><strong>${analisis?.bloom?.nivel}</strong> - ${analisis?.bloom?.justificacion}</p>
        <h3>Nivel DOK:</h3>
        <p><strong>${analisis?.dok?.nivel}</strong> - ${analisis?.dok?.justificacion}</p>
        <h3>Recomendaciones:</h3>
        <p>${analisis?.recomendaciones}</p>
      </div>
    `
    html2pdf().from(element).save(`analisis-reactivo-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-cmp-azul-oscuro">Analiza tu Reactivo</h1>
          </div>
          {analisis && (
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
              <div className="w-10 h-10 bg-cmp-azul-medio rounded-lg flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Análisis Bloom y DOK</CardTitle>
                <CardDescription>
                  Clasifica tu pregunta según taxonomía de Bloom y niveles DOK
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reactivo (Pregunta de Evaluación)</label>
              <Textarea
                value={reactivo}
                onChange={(e) => setReactivo(e.target.value)}
                placeholder='Ejemplo: "Explica cómo los factores bióticos y abióticos influyen en un ecosistema lacustre..."'
                className="min-h-[120px]"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalizar}
              disabled={!reactivo.trim() || loading}
              className="w-full bg-cmp-azul-oscuro hover:bg-cmp-azul-sombra"
            >
              {loading ? 'Analizando...' : 'Analizar Reactivo'}
            </Button>

            {analisis && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-azul-oscuro">Resultados del Análisis</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-cmp-azul-medio rounded">
                    <h4 className="font-semibold text-cmp-azul-oscuro mb-2">Nivel Bloom</h4>
                    <p className="text-2xl font-bold text-cmp-azul-medio mb-2">{analisis.bloom?.nivel}</p>
                    <p className="text-sm text-gray-700">{analisis.bloom?.justificacion}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border-l-4 border-cmp-verde-claro rounded">
                    <h4 className="font-semibold text-cmp-verde-oscuro mb-2">Nivel DOK</h4>
                    <p className="text-2xl font-bold text-cmp-verde-claro mb-2">{analisis.dok?.nivel}</p>
                    <p className="text-sm text-gray-700">{analisis.dok?.justificacion}</p>
                  </div>
                </div>

                {analisis.recomendaciones && (
                  <div className="p-4 bg-amber-50 border-l-4 border-cmp-naranja rounded">
                    <h4 className="font-semibold text-cmp-naranja mb-2">Recomendaciones</h4>
                    <p className="text-sm text-gray-700">{analisis.recomendaciones}</p>
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
