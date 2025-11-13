import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import DashboardLayout from './components/DashboardLayout'
import PlanificadorPage from './pages/PlanificadorPage'
import AnalisisBloomPage from './pages/AnalisisBloomPage'
import GenerarRubricaPage from './pages/GenerarRubricaPage'
import AnalisisBalancePage from './pages/AnalisisBalancePage'
import GenerarPreguntasOAPage from './pages/GenerarPreguntasOAPage'
import GenerarEvaluacionPage from './pages/GenerarEvaluacionPage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<PlanificadorPage />} />
          <Route path="/planificador" element={<PlanificadorPage />} />
          <Route path="/analisis-bloom" element={<AnalisisBloomPage />} />
          <Route path="/generar-rubrica" element={<GenerarRubricaPage />} />
          <Route path="/analisis-balance" element={<AnalisisBalancePage />} />
          <Route path="/generar-preguntas-oa" element={<GenerarPreguntasOAPage />} />
          <Route path="/generar-evaluacion" element={<GenerarEvaluacionPage />} />
          <Route path="*" element={<PlanificadorPage />} />
        </Routes>
      </DashboardLayout>
    </Router>
  )
}

export default App