import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { siteConfig } from '@/config/site'

export function Hero() {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[650px] flex items-center justify-center bg-white overflow-hidden">
      {/* Animated Soft Flowing Waves (Second Image Style) - Hero Only */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Wave Layer 1 */}
        <motion.svg
          className="absolute -bottom-10 left-0 w-[200%] h-[70%] opacity-40"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
        >
          <path
            fill="#e5e7eb"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,165.3C1248,150,1344,139,1392,133.3L1440,128L1440,320L0,320Z"
          />
        </motion.svg>

        {/* Wave Layer 2 */}
        <motion.svg
          className="absolute -bottom-5 left-0 w-[200%] h-[60%] opacity-30"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        >
          <path
            fill="#d1d5db"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,160C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L0,320Z"
          />
        </motion.svg>

        {/* Wave Layer 3 (Soft Top Accent) */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[45%] opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
        >
          <path
            fill="#9ca3af"
            d="M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,128C840,128,960,160,1080,170.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L0,320Z"
          />
        </motion.svg>
      </div>

      {/* Hero Content Centered on 100vh Screen */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 pt-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center justify-center"
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block self-start"
          >
            Creative Portfolio
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight mb-6 leading-none max-w-4xl"
          >
            Visuals by Pritam
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => scrollToSection('portfolio')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              View Portfolio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-white text-gray-800 font-medium text-sm rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Get in Touch
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}