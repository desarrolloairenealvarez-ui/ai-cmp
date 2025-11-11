import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setError('')
        alert('Cuenta creada exitosamente. Ya puedes iniciar sesión.')
        setIsSignUp(false)
        setPassword('')
      } else {
        await signIn(email, password)
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cmp-azul-oscuro via-cmp-azul-sombra to-cmp-azul-medio flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/insignia-madre-paulina.png" 
              alt="Insignia Colegio Madre Paulina" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-cmp-azul-oscuro">
            Colegio Madre Paulina
          </CardTitle>
          <CardDescription className="text-base">
            Plataforma Docente IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-cmp-gris-oscuro">
                Correo Institucional
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu.nombre@madrepaulina.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Solo correos @madrepaulina.cl
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-cmp-gris-oscuro">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-cmp-azul-oscuro hover:bg-cmp-azul-sombra"
            >
              {loading 
                ? 'Procesando...' 
                : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')
              }
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-cmp-azul-oscuro hover:underline"
              >
                {isSignUp 
                  ? '¿Ya tienes cuenta? Inicia sesión' 
                  : '¿Primera vez? Crear cuenta'
                }
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-muted-foreground mt-4">
            Desarrollado por René Álvarez Piñones<br/>
            Copyright © 2025 • Creado con ❤️ para contribuir a la mejora continua
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
