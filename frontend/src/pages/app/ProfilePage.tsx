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
    <div className="flex flex-col gap-5 max-w-2xl pb-16">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">Настройки профиля</h1>
        <p className="text-xs text-[#8d96a0]">Управление учетной записью, валютой и безопасностью</p>
      </div>

      {/* Main Profile Info Form */}
      <form onSubmit={handleUpdateProfile} className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-[#f0f6fc] text-sm">{name || 'Пользователь'}</h3>
            <p className="text-xs text-[#8d96a0] font-mono">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {profileSuccess && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-[#3fb950] text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-[#f85149] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <div className="flex flex-col gap-3.5 pt-3 border-t border-zinc-800/80">
          <Input
            label="Отображаемое имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Основная валюта</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 transition-all text-xs cursor-pointer font-mono"
            >
              <option value="KZT">KZT (₸) — Казахстанский тенге</option>
              <option value="USD">USD ($) — Доллар США</option>
              <option value="EUR">EUR (€) — Евро</option>
              <option value="RUB">RUB (₽) — Российский рубль</option>
            </select>
          </div>

          <Button type="submit" disabled={profileLoading} className="w-fit mt-1">
            {profileLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            Сохранить данные
          </Button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-[#d29922] rounded-lg">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-[#f0f6fc] text-xs">Безопасность и пароль</h3>
            <p className="text-[11px] text-[#8d96a0]">Смена пароля вашей учетной записи</p>
          </div>
        </div>

        {pwdSuccess && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-[#3fb950] text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-[#f85149] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        <div className="flex flex-col gap-3.5 pt-3 border-t border-zinc-800/80">
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

          <Button type="submit" variant="secondary" disabled={pwdLoading} className="w-fit mt-1">
            {pwdLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5 mr-1.5" />}
            Обновить пароль
          </Button>
        </div>
      </form>
    </div>
  )
}
