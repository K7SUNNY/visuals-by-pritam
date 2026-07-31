import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { fadeInUp } from '@/animations/variants'
import { siteConfig } from '@/config/site'

export function About() {
  return (
    <section className="container mx-auto px-4 py-16" id="about">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography variant="overline" color="secondary" className="mb-2">
            About
          </Typography>
          <Typography variant="h2" weight="semibold" className="mb-6">
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
          <Card padding="lg" shadow="sm">
            <Typography variant="body" color="secondary" className="leading-relaxed">
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