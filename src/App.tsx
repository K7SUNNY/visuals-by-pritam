import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './routes/AppRouter'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App