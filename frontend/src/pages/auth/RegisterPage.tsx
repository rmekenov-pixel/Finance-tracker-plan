import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'
import { apiClient } from '@/shared/api/apiClient'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useUserStore((state) => state.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState('KZT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, currency })
      setAuth(res.data.user, res.data.token)
      navigate('/app/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.')
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
          <h2 className="text-2xl font-bold text-slate-100">Создать аккаунт</h2>
          <p className="text-sm text-slate-400 mt-1">Начните вести учет финансов легко</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
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
            <label className="text-xs font-medium text-slate-400">Основная валюта</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            >
              <option value="KZT">KZT (₸) — Казахстанский тенге</option>
              <option value="USD">USD ($) — Доллар США</option>
              <option value="EUR">EUR (€) — Евро</option>
              <option value="RUB">RUB (₽) — Российский рубль</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2 py-3">
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/auth/login" className="text-emerald-400 hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
