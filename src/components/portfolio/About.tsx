import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { fadeInUp } from '@/animations/variants'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function About() {
  const { settings } = useSettings()
  const displayDescription = settings?.description || "I am a visual storyteller and director specializing in cinematic imagery, video production, and fine art photography. I believe that every frame has a story to tell. By blending light, emotion, and technical craft, I collaborate with brands and creators to build visual experiences that feel authentic, memorable, and alive."

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 bg-transparent" id="about">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-8"
        >
          <Typography
            variant="overline"
            color="secondary"
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            About
          </Typography>
          <Typography
            variant="h2"
            weight="semibold"
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            Who I Am
          </Typography>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Card
            padding="lg"
            shadow="sm"
            className="bg-white/70 backdrop-blur-md border border-gray-200/80 shadow-sm rounded-xl p-6 md:p-8"
          >
            <Typography
              variant="body"
              color="secondary"
              className="text-gray-600 leading-relaxed text-base sm:text-lg"
            >
              {displayDescription}
            </Typography>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}