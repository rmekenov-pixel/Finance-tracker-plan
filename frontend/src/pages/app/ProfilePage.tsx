import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useUserStore } from '@/entities/user/model/userStore'

export const ProfilePage: React.FC = () => {
  const { user } = useUserStore()
  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.currency || 'KZT')

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Настройки профиля</h1>
        <p className="text-sm text-slate-400">Управление учетной записью и предпочтениями</p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{name || 'Пользователь'}</h3>
            <p className="text-xs text-slate-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
          <Input label="Отображаемое имя" value={name} onChange={(e) => setName(e.target.value)} />

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

          <Button className="w-fit mt-2">
            <Save className="w-4 h-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  )
}
