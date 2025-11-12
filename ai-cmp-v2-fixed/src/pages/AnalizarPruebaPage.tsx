import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileBarChart, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function AnalizarPruebaPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [contenidoPrueba, setContenidoPrueba] = useState('')
  const [analisis, setAnalisis] = useState<any>(null)
  const [analizando, setAnalizando] = useState(false)
  const { callAI } = useAIAssistant({
    systemPrompt: `Eres un experto en evaluación educativa y análisis cognitivo.
Analiza el conjunto de preguntas y proporciona:
1. Distribución por nivel DOK (DOK 1, 2, 3, 4) con porcentajes
2. Distribución por nivel Bloom con porcentajes
3. Balance cognitivo general (Equilibrado/Desbalanceado)
4. Recomendaciones específicas para mejorar
Responde en JSON: {"distribucion_dok": {...}, "distribucion_bloom": {...}, "balance": "...", "recomendaciones": "..."}`,
    temperature: 0.6,
  })

  async function analizarPrueba() {
    if (!contenidoPrueba.trim()) return
    setAnalizando(true)

    const prompt = `Analiza esta prueba completa:\n\n${contenidoPrueba}\n\nProporciona análisis en JSON.`

    const response = await callAI(prompt)
    setAnalizando(false)

    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setAnalisis(parsed)

        if (user) {
          await supabase.from('pruebas_analizadas').insert({
            user_id: user.id,
            nombre_prueba: `Prueba ${new Date().toLocaleDateString('es-CL')}`,
            contenido_completo: contenidoPrueba,
            analisis_balance: parsed,
            recomendaciones: parsed.recomendaciones,
          })
        }
      } catch (e) {
        console.error('Error parseando respuesta:', e)
      }
    }
  }

  async function exportPDF() {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774;">Análisis de Prueba Completa</h1>
        <p style="color: #666;">Generado: ${new Date().toLocaleString('es-CL')}</p>
        <hr style="border: 1px solid #4a95bf; margin: 20px 0;" />
        
        <h2 style="color: #2c6b8c;">Contenido de la Prueba:</h2>
        <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border: 1px solid #ddd;">
          ${contenidoPrueba.replace(/\n/g, '<br>')}
        </div>
        
        <h2 style="color: #2c6b8c; margin-top: 30px;">Distribución DOK:</h2>
        ${Object.entries(analisis?.distribucion_dok || {})
          .map(([nivel, porcentaje]) => `<p><strong>${nivel}:</strong> ${porcentaje}%</p>`)
          .join('')}
        
        <h2 style="color: #2c6b8c; margin-top: 30px;">Distribución Bloom:</h2>
        ${Object.entries(analisis?.distribucion_bloom || {})
          .map(([nivel, porcentaje]) => `<p><strong>${nivel}:</strong> ${porcentaje}%</p>`)
          .join('')}
        
        <h2 style="color: #2c6b8c; margin-top: 30px;">Balance Cognitivo:</h2>
        <p style="background: #f0f7ff; padding: 15px; border-left: 4px solid #4a95bf;">${analisis?.balance}</p>
        
        <h2 style="color: #2c6b8c; margin-top: 30px;">Recomendaciones:</h2>
        <p>${analisis?.recomendaciones}</p>
      </div>
    `
    html2pdf().from(element).save(`analisis-prueba-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-cmp-azul-sombra">Analiza Prueba Completa</h1>
          </div>
          {analisis && (
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
              <div className="w-10 h-10 bg-cmp-azul-sombra rounded-lg flex items-center justify-center">
                <FileBarChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Análisis de Balance Cognitivo</CardTitle>
                <CardDescription>
                  Agrega las preguntas de tu prueba y analiza su distribución Bloom/DOK
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Textarea
                value={contenidoPrueba}
                onChange={(e) => setContenidoPrueba(e.target.value)}
                placeholder="Pega aquí el contenido completo de tu prueba. Puedes incluir todas las preguntas, instrucciones y cualquier otro material que forme parte de la evaluación..."
                className="min-h-[300px] resize-y"
              />
            </div>

            <Button
              onClick={analizarPrueba}
              disabled={!contenidoPrueba.trim() || analizando}
              className="w-full bg-cmp-azul-sombra hover:bg-cmp-azul-oscuro"
            >
              {analizando ? 'Analizando...' : 'Analizar Prueba Completa'}
            </Button>

            {analisis && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-cmp-azul-sombra">Resultados del Análisis</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-cmp-azul-medio rounded">
                    <h4 className="font-semibold mb-3 text-cmp-azul-oscuro">Distribución DOK</h4>
                    {Object.entries(analisis.distribucion_dok || {}).map(([nivel, porcentaje]: any) => (
                      <div key={nivel} className="flex justify-between mb-1">
                        <span className="text-sm">{nivel}:</span>
                        <span className="font-semibold">{porcentaje}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-green-50 border-l-4 border-cmp-verde-claro rounded">
                    <h4 className="font-semibold mb-3 text-cmp-verde-oscuro">Distribución Bloom</h4>
                    {Object.entries(analisis.distribucion_bloom || {}).map(([nivel, porcentaje]: any) => (
                      <div key={nivel} className="flex justify-between mb-1">
                        <span className="text-sm">{nivel}:</span>
                        <span className="font-semibold">{porcentaje}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border-l-4 border-cmp-naranja rounded">
                  <h4 className="font-semibold mb-2 text-cmp-naranja">Balance Cognitivo</h4>
                  <p className="text-sm text-gray-700">{analisis.balance}</p>
                </div>

                {analisis.recomendaciones && (
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <h4 className="font-semibold mb-2 text-purple-700">Recomendaciones</h4>
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
