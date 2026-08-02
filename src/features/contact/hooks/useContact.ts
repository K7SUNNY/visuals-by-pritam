import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/app/providers/ToastProvider'
import { createMessage } from '@/services/messagesService'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(1000),
})

export type ContactFormData = z.infer<typeof contactSchema>

export function useContact() {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formMethods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
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
      formMethods.reset()
    } catch {
      error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    ...formMethods,
    isSubmitting,
    onSubmit: formMethods.handleSubmit(onSubmit),
  }
}