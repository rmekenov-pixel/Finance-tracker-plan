import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'
import { apiClient } from '@/shared/api/apiClient'
import { GoogleLoginButton } from '@/features/auth/ui/GoogleLoginButton'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const token = useUserStore((state) => state.token)
  const setAuth = useUserStore((state) => state.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState('KZT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      navigate('/app/dashboard', { replace: true })
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        currency,
      })
      setAuth(res.data.user, res.data.token)
      navigate('/app/dashboard')
    } catch (err: any) {
      const valErrors = err.response?.data?.validationErrors
      const msg = valErrors
        ? Object.values(valErrors).join(', ')
        : err.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#f0f6fc]">Создать аккаунт</h2>
          <p className="text-sm text-[#8d96a0] mt-1.5">Начните вести учет финансов легко</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-[#f85149] text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Имя"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Пароль"
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8d96a0]">Основная валюта</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-[#30363d] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium"
            >
              <option value="KZT">KZT (₸) — Казахстанский тенге</option>
              <option value="USD">USD ($) — Доллар США</option>
              <option value="EUR">EUR (€) — Евро</option>
              <option value="RUB">RUB (₽) — Российский рубль</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-3 py-3">
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
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

        <GoogleLoginButton onError={(msg) => setError(msg)} onLoading={setLoading} />

        <p className="text-center text-xs text-[#8d96a0] mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
