import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'
import { apiClient } from '@/shared/api/apiClient'
import { GoogleLoginButton } from '@/features/auth/ui/GoogleLoginButton'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const token = useUserStore((state) => state.token)
  const setAuth = useUserStore((state) => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [token, navigate])

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPass,
      })
      setAuth(res.data.user, res.data.token)
      navigate('/app/dashboard')
    } catch (err: any) {
      const valErrors = err.response?.data?.validationErrors
      const msg = valErrors
        ? Object.values(valErrors).join(', ')
        : err.response?.data?.message || 'Ошибка авторизации. Проверьте данные.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performLogin(email, password)
  }

  const handleDemoLogin = () => {
    setEmail('demo@financetracker.com')
    setPassword('password123')
    performLogin('demo@financetracker.com', 'password123')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#f0f6fc]">Вход в систему</h2>
          <p className="text-sm text-[#8d96a0] mt-1.5">Управляйте личными финансами эффективно</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-[#f85149] text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              label="Email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2 py-3">
            {loading ? 'Вход...' : 'Войти'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#30363d]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#161b22] px-2 text-[#8d96a0]">или продолжить через</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <GoogleLoginButton onError={(msg) => setError(msg)} onLoading={setLoading} />

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] text-sm font-medium rounded-xl border border-[#30363d] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Демо-вход в 1 клик
          </button>
        </div>

        <p className="text-center text-xs text-[#8d96a0] mt-6">
          Нет аккаунта?{' '}
          <Link to="/auth/register" className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
