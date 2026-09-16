import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { apiClient } from '@/shared/api/apiClient'
import { useUserStore } from '@/entities/user/model/userStore'
import { useNavigate } from 'react-router-dom'

interface GoogleLoginButtonProps {
  onError?: (errorMsg: string) => void
  onLoading?: (isLoading: boolean) => void
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onError,
  onLoading,
}) => {
  const navigate = useNavigate()
  const setAuth = useUserStore((state) => state.setAuth)

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      onError?.('Не удалось получить токен от Google')
      return
    }

    onLoading?.(true)
    try {
      const res = await apiClient.post('/auth/google', {
        idToken: credentialResponse.credential,
      })
      setAuth(res.data.user, res.data.token)
      navigate('/app/dashboard')
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Ошибка авторизации через Google аккаунт'
      onError?.(msg)
    } finally {
      onLoading?.(false)
    }
  }

  return (
    <div className="w-full flex justify-center items-center overflow-hidden rounded-xl border border-[#30363d] bg-[#0a0a0c] hover:border-zinc-500 transition-colors py-0.5">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.('Не удалось войти через Google')}
        theme="filled_black"
        shape="rectangular"
        size="large"
        text="signin_with"
        width="100%"
      />
    </div>
  )
}
