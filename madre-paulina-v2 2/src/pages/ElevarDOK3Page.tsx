import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function ElevarDOK3Page({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [reactivoOriginal, setReactivoOriginal] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en niveles DOK (Depth of Knowledge). 
Tu tarea es transformar reactivos educativos a nivel DOK 3 (Pensamiento Estratégico).
Responde en JSON: {"reactivo_dok3": "...", "justificacion": "...", "nivel_original": "DOK 1|2"}`,
    temperature: 0.7,
  })

  async function handleElevar() {
    const prompt = `Transforma este reactivo a nivel DOK 3:\n\n"${reactivoOriginal}"\n\nRespuesta en JSON.`
    const response = await callAI(prompt)
    
    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setResultado(parsed)
        
        if (user) {
          await supabase.from('reactivos_elevados').insert({
            user_id: user.id,
            reactivo_original: reactivoOriginal,
            reactivo_dok3: parsed.reactivo_dok3,
            justificacion: parsed.justificacion,
          })
        }
      } catch (e) {
        setResultado({ error: 'Formato no válido', raw: response })
      }
    }
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
            <h1 className="text-2xl font-bold text-cmp-verde-oscuro">Eleva a DOK 3</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cmp-verde-oscuro rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Transformación a DOK 3</CardTitle>
                <CardDescription>
                  Convierte preguntas básicas en pensamiento estratégico (DOK 3)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reactivo Original (DOK 1 o 2)</label>
              <Textarea
                value={reactivoOriginal}
                onChange={(e) => setReactivoOriginal(e.target.value)}
                placeholder='Ejemplo: "¿Qué es la fotosíntesis?"'
                className="min-h-[100px]"
              />
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">{error}</div>}

            <Button
              onClick={handleElevar}
              disabled={!reactivoOriginal.trim() || loading}
              className="w-full bg-cmp-verde-oscuro hover:bg-cmp-verde-claro"
            >
              {loading ? 'Transformando...' : 'Elevar a DOK 3'}
            </Button>

            {resultado && !resultado.error && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-verde-oscuro">Reactivo Transformado</h3>
                
                <div className="p-4 bg-green-50 border-l-4 border-cmp-verde-claro rounded">
                  <h4 className="font-semibold mb-2">Nuevo Reactivo (DOK 3)</h4>
                  <p className="text-gray-900">{resultado.reactivo_dok3}</p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-cmp-azul-medio rounded">
                  <h4 className="font-semibold mb-2">Justificación</h4>
                  <p className="text-sm text-gray-700">{resultado.justificacion}</p>
                  <p className="text-xs text-gray-500 mt-2">Nivel original detectado: {resultado.nivel_original}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
