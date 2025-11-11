import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ChatIAPage } from './pages/ChatIAPage'
import { AnalizarReactivoPage } from './pages/AnalizarReactivoPage'
import { ElevarDOK3Page } from './pages/ElevarDOK3Page'
import { GenerarRubricaPage } from './pages/GenerarRubricaPage'
import { AnalizarPruebaPage } from './pages/AnalizarPruebaPage'
import { PreguntasOAPage } from './pages/PreguntasOAPage'
import { RetroalimentacionPage } from './pages/RetroalimentacionPage'
import { GenerarEvaluacionPage } from './pages/GenerarEvaluacionPage'
import { PlanificacionPage } from './pages/PlanificacionPage'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentModule, setCurrentModule] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cmp-azul-medio border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cmp-gris-oscuro">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  // Renderizar módulo activo o dashboard
  const handleBack = () => setCurrentModule(null)

  switch (currentModule) {
    case 'chat-ia':
      return <ChatIAPage onBack={handleBack} />
    case 'analizar-reactivo':
      return <AnalizarReactivoPage onBack={handleBack} />
    case 'elevar-dok3':
      return <ElevarDOK3Page onBack={handleBack} />
    case 'generar-rubrica':
      return <GenerarRubricaPage onBack={handleBack} />
    case 'analizar-prueba':
      return <AnalizarPruebaPage onBack={handleBack} />
    case 'preguntas-oa':
      return <PreguntasOAPage onBack={handleBack} />
    case 'retroalimentacion':
      return <RetroalimentacionPage onBack={handleBack} />
    case 'generar-evaluacion':
      return <GenerarEvaluacionPage onBack={handleBack} />
    case 'planificacion':
      return <PlanificacionPage onBack={handleBack} />
    default:
      return <DashboardPage onModuleClick={setCurrentModule} />
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
