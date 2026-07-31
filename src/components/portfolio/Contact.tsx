import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/app/providers/ToastProvider'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(1000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function Contact() {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement actual contact form submission
      success('Message sent successfully')
      reset()
    } catch {
      error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-16" id="contact">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-8"
        >
          <Typography variant="overline" color="secondary" className="mb-2">
            Contact
          </Typography>
          <Typography variant="h2" weight="semibold">
            Get in Touch
          </Typography>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeInUp}>
            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Contact Information
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="caption" color="tertiary">
                      Email
                    </Typography>
                    <Typography variant="body">
                      hello@visualsbypritam.com
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="caption" color="tertiary">
                      Phone
                    </Typography>
                    <Typography variant="body">
                      +1 (555) 000-0000
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Send a Message
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-error">{errors.name.message}</p>
                )}
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-error">{errors.email.message}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-2.5 text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="text-sm text-error mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}