import React, { useState, useEffect } from 'react'
import { Save, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'
import { userApi } from '@/entities/user/api/userApi'

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useUserStore()

  // Profile Form State
  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.currency || 'KZT')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password Form State
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null)
  const [pwdError, setPwdError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setCurrency(user.currency)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)
    setProfileLoading(true)

    try {
      const updated = await userApi.updateProfile({ name, currency })
      updateUser(updated)
      setProfileSuccess('Профиль успешно обновлен!')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setProfileError(e.response?.data?.message || 'Ошибка обновления профиля')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError(null)
    setPwdSuccess(null)

    if (newPassword.length < 6) {
      setPwdError('Новый пароль должен содержать не менее 6 символов')
      return
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Новый пароль и подтверждение не совпадают')
      return
    }

    setPwdLoading(true)
    try {
      await userApi.changePassword({ oldPassword, newPassword })
      setPwdSuccess('Пароль успешно изменен!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setPwdError(e.response?.data?.message || 'Ошибка изменения пароля. Проверьте текущий пароль.')
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Настройки профиля</h1>
        <p className="text-sm text-slate-400">Управление учетной записью, валютой и безопасностью</p>
      </div>

      {/* Main Profile Info Form */}
      <form onSubmit={handleUpdateProfile} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-lg">{name || 'Пользователь'}</h3>
            <p className="text-xs text-slate-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {profileSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
          <Input
            label="Отображаемое имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Основная валюта</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm cursor-pointer"
            >
              <option value="KZT">KZT (₸) — Казахстанский тенге</option>
              <option value="USD">USD ($) — Доллар США</option>
              <option value="EUR">EUR (€) — Евро</option>
              <option value="RUB">RUB (₽) — Российский рубль</option>
            </select>
          </div>

          <Button type="submit" disabled={profileLoading} className="w-fit mt-2">
            {profileLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Сохранить данные
          </Button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">Безопасность и пароль</h3>
            <p className="text-xs text-slate-400">Смена пароля вашей учетной записи</p>
          </div>
        </div>

        {pwdSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
          <Input
            label="Текущий пароль"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <Input
            label="Новый пароль"
            type="password"
            placeholder="Минимум 6 символов"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Подтвердите новый пароль"
            type="password"
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="secondary" disabled={pwdLoading} className="w-fit mt-2">
            {pwdLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
            Обновить пароль
          </Button>
        </div>
      </form>
    </div>
  )
}
