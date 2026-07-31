import { type ClassValue, clsx } from 'clsx'
import { cva, type VariantProps } from 'class-variance-authority'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export { cva, type VariantProps }