import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-heading font-medium mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Page not found
      </p>
      <Link
        to="/"
        className="text-primary hover:underline"
      >
        Go back home
      </Link>
    </div>
  )
}