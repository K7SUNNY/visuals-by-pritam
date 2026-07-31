import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from './supportedFormats'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateMedia(
  file: File,
  allowedTypes: readonly string[] = []
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (file.size === 0) {
    errors.push('File is empty')
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`Unsupported file type: ${file.type}`)
  }

  if (file.name.length > 255) {
    errors.push('File name exceeds 255 characters')
  }

  if (file.name.includes('/') || file.name.includes('\\')) {
    errors.push('File name contains invalid characters')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateImage(file: File): ValidationResult {
  return validateMedia(file, [...SUPPORTED_IMAGE_TYPES])
}

export function validateVideo(file: File): ValidationResult {
  return validateMedia(file, [...SUPPORTED_VIDEO_TYPES])
}