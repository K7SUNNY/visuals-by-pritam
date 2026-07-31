import { motion } from 'framer-motion'

export function HeroWaves() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {/* Animated Layer 1 */}
            <motion.svg
                className="absolute bottom-0 left-0 w-[200%] h-full opacity-20"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            >
                <path
                    fill="#f97316"
                    d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,165.3C1248,150,1344,139,1392,133.3L1440,128L1440,320L0,320Z"
                />
            </motion.svg>

            {/* Animated Layer 2 */}
            <motion.svg
                className="absolute bottom-0 left-0 w-[200%] h-full opacity-15"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                animate={{ x: ['-50%', '0%'] }}
                transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            >
                <path
                    fill="#ea580c"
                    d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,160C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L0,320Z"
                />
            </motion.svg>
        </div>
    )
}