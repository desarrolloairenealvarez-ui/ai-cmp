import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  FileSearch, 
  TrendingUp, 
  ClipboardCheck,
  FileBarChart,
  Target,
  MessageSquare,
  Calendar,
  LogOut
} from 'lucide-react'
import { useState } from 'react'

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick: () => void
}

function ModuleCard({ title, description, icon, color, onClick }: ModuleCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
      onClick={onClick}
    >
      <CardHeader>
        <div className={`w-14 h-14 rounded-lg ${color} flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

interface DashboardPageProps {
  onModuleClick: (moduleId: string) => void
}

export function DashboardPage({ onModuleClick }: DashboardPageProps) {
  const { user, signOut } = useAuth()

  const modules = [
    {
      id: 'planificacion',
      title: 'Planificador Secuencia',
      description: 'Crea planificaciones didácticas con IA',
      icon: <Calendar className="w-8 h-8 text-white" />,
      color: 'bg-cmp-azul-oscuro'
    },
    {
      id: 'analizar-reactivo',
      title: 'Analiza tu Reactivo',
      description: 'Clasifica preguntas según Bloom y DOK',
      icon: <FileSearch className="w-8 h-8 text-white" />,
      color: 'bg-cmp-azul-medio'
    },
    {
      id: 'elevar-dok3',
      title: 'Eleva a DOK 3',
      description: 'Transforma preguntas básicas en DOK 3',
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      color: 'bg-cmp-verde-oscuro'
    },
    {
      id: 'generar-rubrica',
      title: 'Genera Rúbrica',
      description: 'Crea rúbricas detalladas de evaluación',
      icon: <ClipboardCheck className="w-8 h-8 text-white" />,
      color: 'bg-cmp-naranja'
    },
    {
      id: 'analizar-prueba',
      title: 'Analiza Prueba Completa',
      description: 'Balance cognitivo de evaluaciones',
      icon: <FileBarChart className="w-8 h-8 text-white" />,
      color: 'bg-cmp-azul-sombra'
    },
    {
      id: 'preguntas-oa',
      title: 'Preguntas por OA',
      description: 'Genera preguntas según objetivos',
      icon: <Target className="w-8 h-8 text-white" />,
      color: 'bg-cmp-verde-claro'
    },
    {
      id: 'retroalimentacion',
      title: 'Retroalimentación',
      description: 'Feedback constructivo para estudiantes',
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      color: 'bg-success'
    },
    {
      id: 'chat-ia',
      title: 'Chat con IA',
      description: 'Consulta al asistente educativo',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'bg-cmp-azul-medio'
    },
    {
      id: 'generar-evaluacion',
      title: 'Genera Evaluación',
      description: 'Crea evaluaciones desde planificaciones',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'bg-cmp-azul-oscuro'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/insignia-madre-paulina.png" 
              alt="Insignia Colegio Madre Paulina" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-cmp-azul-oscuro">
                Colegio Madre Paulina
              </h1>
              <p className="text-sm text-muted-foreground">Plataforma Docente IA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-cmp-gris-oscuro">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground">Docente</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-cmp-azul-oscuro hover:text-white hover:bg-cmp-azul-oscuro"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-cmp-azul-oscuro mb-2">
            Módulos Educativos
          </h2>
          <p className="text-muted-foreground">
            Selecciona un módulo para comenzar a trabajar con IA
          </p>
        </div>

        {/* Grid de Módulos - 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              color={module.color}
              onClick={() => onModuleClick(module.id)}
            />
          ))}
        </div>
      </main>
      
      {/* Footer con Copyright */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Desarrollado por René Álvarez Piñones</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Copyright © 2025</span>
            <span>•</span>
            <span className="text-sm text-muted-foreground">Creado con ❤️ para contribuir a la mejora continua</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
