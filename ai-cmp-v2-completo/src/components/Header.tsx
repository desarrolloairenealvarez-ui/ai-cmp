import React from 'react'

interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`fixed top-0 left-0 z-50 w-full bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre del colegio */}
          <div className="flex items-center space-x-3">
            <img 
              src="/insignia-madre-paulina.png" 
              alt="Colegio Madre Paulina" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-cmp-azul-medio">
                Colegio Madre Paulina
              </h1>
              <p className="text-xs text-cmp-gris-oscuro">
                Asistente Pedagógico IA
              </p>
            </div>
          </div>
          
          {/* Título de la página actual (se puede personalizar) */}
          <div className="flex-1 text-center">
            <h2 className="text-sm font-medium text-gray-700 hidden sm:block">
              Plataforma Docente
            </h2>
          </div>
          
          {/* Espaciador */}
          <div className="w-24"></div>
        </div>
      </div>
    </header>
  )
}