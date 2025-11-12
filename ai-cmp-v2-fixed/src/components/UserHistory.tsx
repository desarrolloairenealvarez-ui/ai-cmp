```tsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Download, FileText, Brain, Users, Target, FileOutput, MessageSquare } from 'lucide-react'

interface WorkHistoryItem {
  id: string
  module_name: string
  work_data: any
  created_at: string
}

const moduleIcons: { [key: string]: React.ElementType } = {
  'ChatIA': MessageSquare,
  'AnalizarReactivo': Brain,
  'ElevarDOK3': Target,
  'GenerarRubrica': FileText,
  'AnalizarPrueba': Users,
  'PreguntasOA': Target,
  'Retroalimentacion': MessageSquare,
  'GenerarEvaluacion': FileOutput,
  'Planificacion': FileText
}

const moduleNames: { [key: string]: string } = {
  'ChatIA': 'Chat IA',
  'AnalizarReactivo': 'Análisis de Reactivos',
  'ElevarDOK3': 'Elevar a DOK 3',
  'GenerarRubrica': 'Generar Rúbricas',
  'AnalizarPrueba': 'Análisis de Prueba',
  'PreguntasOA': 'Preguntas por Objetivo',
  'Retroalimentacion': 'Retroalimentación',
  'GenerarEvaluacion': 'Generar Evaluación',
  'Planificacion': 'Planificación'
}

export function UserHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState<WorkHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  async function loadHistory() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_work_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error cargando historial:', error)
        return
      }

      setHistory(data || [])
    } catch (error) {
      console.error('Error cargando historial:', error)
    } finally {
      setLoading(false)
    }
  }

  async function exportHistory() {
    if (history.length === 0) return

    const element = document.createElement('div')
    const historialHtml = history.map((item, index) => {
      const moduleName = moduleNames[item.module_name] || item.module_name
      const fecha = new Date(item.created_at).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      return `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #2c6b8c; margin-bottom: 5px;">${index + 1}. ${moduleName}</h3>
          <p style="color: #666; font-size: 12px; margin-bottom: 10px;">Fecha: ${fecha}</p>
          <div style="background: #f9f9f9; padding: 10px; border-radius: 3px;">
            <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(item.work_data, null, 2)}</pre>
          </div>
        </div>
      `
    }).join('')

    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2b5774; border-bottom: 2px solid #4a95bf; padding-bottom: 10px;">
          Historial de Trabajo - ${moduleNames[user?.user_metadata?.module] || 'Usuario'}
        </h1>
        <p style="color: #666;">Generado: ${new Date().toLocaleString('es-CL')}</p>
        <hr style="border: 1px solid #4a95bf; margin: 20px 0;" />
        <h2 style="color: #2c6b8c;">Total de actividades: ${history.length}</h2>
        ${historialHtml}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
          <p>Generado con IA - Plataforma Docente Colegio Madre Paulina</p>
        </div>
      </div>
    `

    const html2pdf = require('html2pdf.js')
    html2pdf().from(element).save(`historial-trabajo-${Date.now()}.pdf`)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmp-azul-medio mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando historial...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cmp-azul-medio" />
              Historial de Trabajo
            </CardTitle>
            <CardDescription>
              Registro de todas tus actividades en el asistente pedagógico
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button onClick={exportHistory} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aún no tienes actividades registradas</p>
            <p className="text-sm text-gray-400">
              Comienza a usar los módulos del asistente para ver tu historial aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de actividades: {history.length}</span>
              <span>Última actualización: {new Date().toLocaleDateString('es-CL')}</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {history.map((item) => {
                const Icon = moduleIcons[item.module_name] || FileText
                const moduleName = moduleNames[item.module_name] || item.module_name
                const fecha = new Date(item.created_at).toLocaleDateString('es-CL', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-cmp-azul-soft rounded-lg">
                      <Icon className="w-4 h-4 text-cmp-azul-medio" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{moduleName}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {item.work_data?.status || 'completado'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{fecha}</p>
                      {item.work_data?.tipo && (
                        <p className="text-xs text-gray-500">
                          Tipo: {item.work_data.tipo}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```
