import { motion } from 'framer-motion'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { WavyBackground } from '@/components/common/WavyBackground'

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white text-gray-900 overflow-hidden px-4">
      {/* Background Wavy Strings */}
      <WavyBackground />

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white border border-gray-200/90 shadow-sm rounded-xl p-8 sm:p-10"
      >
        {/* Simple Text Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
            Visuals by Pritam
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Admin Portal
          </p>
        </div>

        {/* Form Container */}
        <LoginForm />

        {/* Minimal Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 font-normal">
          Visuals Studio CMS
        </div>
      </motion.div>
    </div>
  )
}