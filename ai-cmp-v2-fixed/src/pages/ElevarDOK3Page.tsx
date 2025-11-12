import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowLeft } from 'lucide-react'

export function ElevarDOK3Page({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [reactivoOriginal, setReactivoOriginal] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: 'Eres un experto en niveles DOK (Depth of Knowledge). Tu tarea es transformar reactivos educativos a nivel DOK 3 (Pensamiento Estratégico). Responde en JSON: {"reactivo_dok3": "...", "justificacion": "...", "nivel_original": "DOK 1|2"}',
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

      
