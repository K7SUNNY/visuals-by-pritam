import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { fadeInUp } from '@/animations/variants'
import { siteConfig } from '@/config/site'

export function About() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20" id="about">
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
            className="bg-white border border-gray-200/80 shadow-sm rounded-xl p-6 md:p-8"
          >
            <Typography
              variant="body"
              color="secondary"
              className="text-gray-600 leading-relaxed text-base sm:text-lg"
            >
              {siteConfig.description}. I create visual experiences
              that blend creativity with technology. Each project is
              crafted with attention to detail and a focus on delivering
              impactful results.
            </Typography>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}