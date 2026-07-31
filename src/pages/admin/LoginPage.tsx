import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-heading font-medium text-center mb-8">
          Visuals by Pritam
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}