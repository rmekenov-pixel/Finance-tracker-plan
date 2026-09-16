import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'
import { apiClient } from '@/shared/api/apiClient'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useUserStore((state) => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      setAuth(res.data.user, res.data.token)
      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации. Проверьте данные.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 mb-3">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Вход в систему</h2>
          <p className="text-sm text-slate-400 mt-1">Управляйте личными финансами эффективно</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
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

        <p className="text-center text-xs text-slate-400 mt-6">
          Нет аккаунта?{' '}
          <Link to="/auth/register" className="text-emerald-400 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
