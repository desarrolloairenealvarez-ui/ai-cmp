import { Link, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { 
  FiHome, 
  FiTarget, 
  FiFileText, 
  FiBarChart, 
  FiHelpCircle, 
  FiRotateCw,
  FiEdit3 
} from 'react-icons/fi'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Planificador', href: '/planificador', icon: FiTarget },
  { name: 'Análisis de Bloom', href: '/analisis-bloom', icon: FiBarChart },
  { name: 'Generador de Rúbricas', href: '/generar-rubrica', icon: FiFileText },
  { name: 'Análisis de Balance', href: '/analisis-balance', icon: FiRotateCw },
  { name: 'Generar Preguntas OA', href: '/generar-preguntas-oa', icon: FiHelpCircle },
  { name: 'Generar Evaluación', href: '/generar-evaluacion', icon: FiEdit3 },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with colegio badge */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and badge - PERMANENT */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                🎓
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Madre Paulina</h1>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Colegio Madre Paulina
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link key={item.name} to={item.href}>
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className="md:hidden bg-white border-b px-4 py-2">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link key={item.name} to={item.href}>
                <Button 
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Toaster />
    </div>
  )
}