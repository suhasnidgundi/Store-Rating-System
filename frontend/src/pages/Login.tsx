import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema } from '../utils/validators'  // Updated import path
import { LoginForm } from '../types'  // LoginForm is correctly from types
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export const Login = () => {
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            error={errors.email?.message}
          />
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full" loading={isLoading}>
            Login
          </Button>
        </form>
        {error && <p className="text-sm text-red-600">{error.message}</p>}
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </Card>
    </div>
  )
}