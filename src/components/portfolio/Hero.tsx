import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { siteConfig } from '@/config/site'

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface to-bg" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="overline"
              color="secondary"
              className="mb-6"
            >
              Creative Portfolio
            </Typography>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-8"
          >
            Visuals by Pritam
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg">
              <a href="#portfolio" className="block">
                View Portfolio
              </a>
            </Button>
            <Button variant="secondary" size="lg">
              <a href="#contact" className="block">
                Get in Touch
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}