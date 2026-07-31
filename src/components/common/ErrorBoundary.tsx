import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-medium mb-4">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}