import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, ArrowLeft, Copy, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatIAPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const { callAI, loading } = useAIAssistant({
    systemPrompt: `Eres un asistente educativo experto del Colegio Madre Paulina. 
Tu objetivo es ayudar a los docentes con:
- Planificación curricular
- Diseño de evaluaciones
- Taxonomía de Bloom y Niveles DOK (Depth of Knowledge)
- Metodologías pedagógicas innovadoras
- Diferenciación y atención a la diversidad

Proporciona respuestas claras, fundamentadas pedagógicamente y específicas para el contexto escolar chileno.`,
    temperature: 0.8,
  })

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const aiResponse = await callAI(input)

    if (aiResponse) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Guardar en base de datos
      if (user) {
        await supabase.from('chat_historicos').insert({
          user_id: user.id,
          pregunta: input,
          respuesta: aiResponse,
          contexto: 'Chat General',
        })
      }
    }
  }

  async function exportPDF() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774; border-bottom: 3px solid #4a95bf; padding-bottom: 10px;">
          Chat con IA - Colegio Madre Paulina
        </h1>
        <p style="color: #666; margin-bottom: 30px;">
          Generado: ${new Date().toLocaleString('es-CL')} | Usuario: ${user?.email}
        </p>
        ${messages
          .map(
            (msg) => `
          <div style="margin-bottom: 20px; padding: 15px; background: ${
            msg.role === 'user' ? '#f0f7ff' : '#f8f9fa'
          }; border-left: 4px solid ${msg.role === 'user' ? '#4a95bf' : '#78aa47'}; border-radius: 4px;">
            <strong style="color: ${msg.role === 'user' ? '#2b5774' : '#4b722d'};">
              ${msg.role === 'user' ? 'Docente' : 'IA'}:
            </strong>
            <p style="margin-top: 8px; white-space: pre-wrap;">${msg.content}</p>
            <small style="color: #999;">${msg.timestamp.toLocaleTimeString('es-CL')}</small>
          </div>
        `
          )
          .join('')}
      </div>
    `

    const opt = {
      margin: 10,
      filename: `chat-ia-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-cmp-azul-oscuro">Chat con IA</h1>
          </div>
          {messages.length > 0 && (
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
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Asistente Educativo IA</CardTitle>
                <CardDescription>
                  Pregunta sobre pedagogía, evaluación y planificación curricular
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Área de mensajes */}
            <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-cmp-azul-medio" />
                    <p className="font-medium">Inicia una conversación</p>
                    <p className="text-sm">Haz una pregunta sobre educación y pedagogía</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-cmp-azul-medio text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-cmp-azul-oscuro' : 'text-muted-foreground'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString('es-CL')}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cmp-azul-medio rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cmp-azul-medio rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cmp-azul-medio rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Escribe tu pregunta sobre educación..."
                className="min-h-[80px]"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-cmp-azul-oscuro hover:bg-cmp-azul-sombra"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
