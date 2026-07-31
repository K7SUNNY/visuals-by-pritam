import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '@/lib/validations/auth'
import { useToast } from '@/app/providers/ToastProvider'
import { login } from '@/features/auth'
import type { LoginCredentials } from '@/types/auth'

export function LoginForm() {
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true)
    try {
      await login(data)
      success('Login successful')
      navigate('/admin/dashboard')
    } catch {
      error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register('email')}
          className={`w-full px-4 py-3 bg-gray-50/50 border rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.email
              ? 'border-red-400 focus:ring-red-100'
              : 'border-gray-200 focus:border-blue-600 focus:ring-blue-100'
            }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1.5 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={`w-full px-4 py-3 bg-gray-50/50 border rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.password
              ? 'border-red-400 focus:ring-red-100'
              : 'border-gray-200 focus:border-blue-600 focus:ring-blue-100'
            }`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1.5 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}