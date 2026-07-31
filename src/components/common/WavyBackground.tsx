import { motion } from 'framer-motion'

export function WavyBackground() {
    // Generate multi-crest water wave paths (like ~~~)
    const generateWavePath = (
        yOffset: number,
        amplitude: number,
        frequency: number,
        phase: number
    ) => {
        const width = 1600
        const points = []
        const step = 40 // Resolution of wave curve

        for (let x = -100; x <= width; x += step) {
            // Combination of two sine waves to create organic, random water dips (~ effect)
            const y1 = Math.sin((x * frequency + phase) * (Math.PI / 180)) * amplitude
            const y2 = Math.cos((x * (frequency * 0.5) - phase) * (Math.PI / 180)) * (amplitude * 0.4)
            const y = yOffset + y1 + y2
            points.push(`${x},${y}`)
        }

        return `M ${points.join(' L ')}`
    }

    return (
        <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
            <svg
                className="w-full h-full opacity-45"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 900"
                preserveAspectRatio="none"
            >
                {Array.from({ length: 20 }).map((_, i) => {
                    const yOffset = 80 + i * 40
                    const amplitude = 18 + (i % 5) * 4 // Wave height dips
                    const frequency = 0.35 + (i % 3) * 0.05 // Crest frequency (dips per line)

                    const pathA = generateWavePath(yOffset, amplitude, frequency, 0)
                    const pathB = generateWavePath(yOffset, amplitude * 1.2, frequency, 180)
                    const pathC = generateWavePath(yOffset, amplitude, frequency, 360)

                    return (
                        <motion.path
                            key={i}
                            fill="none"
                            stroke="#94a3b8" /* Subtle soft slate color */
                            strokeWidth={i % 3 === 0 ? "1.2" : "0.75"}
                            strokeDasharray={i % 6 === 0 ? "4 4" : "none"}
                            initial={{ d: pathA }}
                            animate={{ d: [pathA, pathB, pathC, pathA] }}
                            transition={{
                                duration: 12 + i * 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    )
                })}
            </svg>
        </div>
    )
}