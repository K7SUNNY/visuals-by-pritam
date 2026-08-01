import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/app/providers/ToastProvider'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMessage } from '@/services/messagesService'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(1000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function Contact() {
  const { success, error } = useToast()
  const { settings, isLoading } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactEmail = settings?.contactEmail ?? 'hello@visualsbypritam.com'
  const contactPhone = settings?.contactPhone ?? '+1 (555) 000-0000'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await createMessage({
        name: data.name,
        email: data.email,
        message: data.message,
      })
      success('Message sent successfully')
      reset()
    } catch {
      error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 bg-transparent" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-40 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200/80 rounded-xl p-6 space-y-6">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="space-y-4">
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-xl p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-20 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 bg-transparent" id="contact">
      <div className="max-w-4xl mx-auto">
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
            Contact
          </Typography>
          <Typography
            variant="h2"
            weight="semibold"
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            Get in Touch
          </Typography>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          {/* Contact Information Card */}
          <motion.div variants={fadeInUp}>
            <Card padding="lg" shadow="sm" className="bg-white border border-gray-200/80 p-6 rounded-xl shadow-sm space-y-6">
              <Typography variant="h5" weight="medium" className="text-lg font-semibold text-gray-900">
                Contact Information
              </Typography>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="caption" color="tertiary" className="text-xs uppercase font-semibold text-gray-400">
                      Email
                    </Typography>
                    <Typography variant="body" className="text-sm font-medium text-gray-900">
                      {contactEmail}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="caption" color="tertiary" className="text-xs uppercase font-semibold text-gray-400">
                      Phone
                    </Typography>
                    <Typography variant="body" className="text-sm font-medium text-gray-900">
                      {contactPhone}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={fadeInUp}>
            <Card padding="lg" shadow="sm" className="bg-white border border-gray-200/80 p-6 rounded-xl shadow-sm">
              <Typography variant="h5" weight="medium" className="text-lg font-semibold text-gray-900 mb-4">
                Send a Message
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  icon={<MessageCircle className="w-4 h-4" />}
                >
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