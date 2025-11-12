import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardCheck, ArrowLeft, FileDown } from 'lucide-react'
import html2pdf from 'html2pdf.js'

export function GenerarRubricaPage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [titulo, setTitulo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [nivel, setNivel] = useState('')
  const [rubrica, setRubrica] = useState<any>(null)
  const { callAI, loading, error } = useAIAssistant({
    systemPrompt: `Eres un experto en diseño de rúbricas de evaluación. 
Genera rúbricas analíticas con 4 niveles: Destacado, Competente, En Desarrollo, Inicial.
Responde en JSON: {"criterios": [{"nombre": "...", "destacado": "...", "competente": "...", "en_desarrollo": "...", "inicial": "..."}], "puntaje_total": 100}`,
    temperature: 0.6,
  })

  async function handleGenerar() {
    const prompt = `Genera una rúbrica de evaluación para:
Título: ${titulo}
Objetivo: ${objetivo}
Nivel: ${nivel}

Incluye al menos 4 criterios de evaluación con descriptores claros para cada nivel.`
    
    const response = await callAI(prompt)
    
    if (response) {
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, '').trim())
        setRubrica(parsed)
        
        if (user) {
          await supabase.from('rubricas_generadas').insert({
            user_id: user.id,
            titulo,
            objetivo,
            nivel,
            contenido_rubrica: parsed,
          })
        }
      } catch (e) {
        setRubrica({ error: 'Formato no válido', raw: response })
      }
    }
  }

  async function exportPDF() {
    const criteriosHTML = rubrica?.criterios?.map((c: any, idx: number) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${c.nombre}</td>
        <td style="border: 1px solid #ddd; padding: 8px; background: #d4edda;">${c.destacado}</td>
        <td style="border: 1px solid #ddd; padding: 8px; background: #fff3cd;">${c.competente}</td>
        <td style="border: 1px solid #ddd; padding: 8px; background: #f8d7da;">${c.en_desarrollo}</td>
        <td style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">${c.inicial}</td>
      </tr>
    `).join('') || ''

    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774;">${titulo}</h1>
        <p><strong>Objetivo:</strong> ${objetivo}</p>
        <p><strong>Nivel:</strong> ${nivel}</p>
        <hr style="margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #2b5774; color: white;">
              <th style="border: 1px solid #ddd; padding: 10px;">Criterio</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Destacado</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Competente</th>
              <th style="border: 1px solid #ddd; padding: 10px;">En Desarrollo</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Inicial</th>
            </tr>
          </thead>
          <tbody>${criteriosHTML}</tbody>
        </table>
        <p style="margin-top: 20px;"><strong>Puntaje Total:</strong> ${rubrica?.puntaje_total} puntos</p>
      </div>
    `
    html2pdf().from(element).save(`rubrica-${Date.now()}.pdf`)
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
            <h1 className="text-2xl font-bold text-cmp-naranja">Genera Rúbrica</h1>
          </div>
          {rubrica && (
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
              <div className="w-10 h-10 bg-cmp-naranja rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Generador de Rúbricas</CardTitle>
                <CardDescription>
                  Crea rúbricas de evaluación con criterios e indicadores claros
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la Evaluación</label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Ensayo Argumentativo" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nivel Educativo</label>
                <Input value={nivel} onChange={(e) => setNivel(e.target.value)} placeholder="Ej: 8° Básico" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Objetivo de Aprendizaje</label>
              <Textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Ej: Escribir un ensayo argumentativo coherente con tesis clara y evidencia..."
                className="min-h-[80px]"
              />
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded text-sm">{error}</div>}

            <Button
              onClick={handleGenerar}
              disabled={!titulo || !objetivo || loading}
              className="w-full bg-cmp-naranja hover:bg-cmp-naranja/90"
            >
              {loading ? 'Generando Rúbrica...' : 'Generar Rúbrica'}
            </Button>

            {rubrica && !rubrica.error && (
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4 text-cmp-naranja">Rúbrica Generada</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-cmp-azul-oscuro text-white">
                        <th className="border p-2">Criterio</th>
                        <th className="border p-2 bg-green-600">Destacado</th>
                        <th className="border p-2 bg-yellow-600">Competente</th>
                        <th className="border p-2 bg-orange-600">En Desarrollo</th>
                        <th className="border p-2 bg-red-600">Inicial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rubrica.criterios?.map((criterio: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border p-2 font-semibold">{criterio.nombre}</td>
                          <td className="border p-2 bg-green-50">{criterio.destacado}</td>
                          <td className="border p-2 bg-yellow-50">{criterio.competente}</td>
                          <td className="border p-2 bg-orange-50">{criterio.en_desarrollo}</td>
                          <td className="border p-2 bg-red-50">{criterio.inicial}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 text-right font-semibold">Puntaje Total: {rubrica.puntaje_total} puntos</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
