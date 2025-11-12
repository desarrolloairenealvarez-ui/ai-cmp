import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, ArrowLeft, Calendar, FileText, Clock } from 'lucide-react'

interface WorkHistoryEntry {
  id: string
  tipo_actividad: string
  titulo: string
  descripcion: string
  fecha_creacion: string
  module_name: string
}

export function UserHistory({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  const [history, setHistory] = useState<WorkHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_work_history')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_creacion', { ascending: false })

      if (error) throw error
      setHistory(data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModuleIcon = (moduleName: string) => {
    const icons: Record<string, string> = {
      'generar_rubrica': '📝',
      'elevar_dok3': '📈',
      'crear_actividades': '🎯',
      'default': '📄'
    }
    return icons[moduleName] || icons['default']
  }

  const getModuleColor = (moduleName: string) => {
    const colors: Record<string, string> = {
      'generar_rubrica': 'bg-orange-100 text-orange-800',
      'elevar_dok3': 'bg-green-100 text-green-800',
      'crear_actividades': 'bg-blue-100 text-blue-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[moduleName] || colors['default']
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cmp-verde-oscuro mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-cmp-verde-oscuro flex items-center gap-2">
              <History className="w-6 h-6" />
              Mi Historial
            </h1>
          </div>
          <Button onClick={fetchHistory} variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay actividad aún
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza a crear contenido para ver tu historial aquí.
              </p>
              <Button onClick={onBack} className="bg-cmp-verde-oscuro hover:bg-cmp-verde-claro">
                Ir a Herramientas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Actividad Reciente ({history.length} actividades)
              </h2>
            </div>
            
            {history.map((entry, idx) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-cmp-verde-oscuro rounded-lg flex items-center justify-center text-white text-lg">
                        {getModuleIcon(entry.module_name)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {entry.titulo || 'Sin título'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(entry.module_name)}`}>
                          {entry.module_name}
                        </span>
                      </div>
                      
                      {entry.descripcion && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {entry.descripcion}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.fecha_creacion)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {entry.tipo_actividad}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
