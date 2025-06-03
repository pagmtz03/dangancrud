/**
 * Validaciones para el formulario de personajes
 */
export const characterValidations = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-.']+$/,
    errorMessages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters long',
      maxLength: 'Name cannot exceed 50 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, periods, and apostrophes'
    }
  },
  talent: {
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessages: {
      required: 'Talent is required',
      minLength: 'Talent must be at least 2 characters long',
      maxLength: 'Talent cannot exceed 100 characters'
    }
  },
  gender: {
    required: true,
    enum: ['Male', 'Female', 'None'],
    errorMessages: {
      required: 'Gender is required',
      enum: 'Gender must be Male, Female, or None'
    }
  },
  height: {
    required: true,
    pattern: /^\d+(\.\d+)?\s*(cm|CM|centimeters?)$/i,
    errorMessages: {
      required: 'Height is required',
      pattern: 'Height must be in format "XXX cm" (e.g., "171 cm")'
    }
  },
  weight: {
    required: true,
    pattern: /^\d+(\.\d+)?\s*(kg|KG|kilograms?)$/i,
    errorMessages: {
      required: 'Weight is required',
      pattern: 'Weight must be in format "XX kg" (e.g., "58 kg")'
    }
  },
  birthday: {
    required: true,
    pattern: /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}$/,
    errorMessages: {
      required: 'Birthday is required',
      pattern: 'Birthday must be in format "Month Day" (e.g., "September 7")'
    }
  },
  image: {
    required: false,
    pattern: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)|\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
    errorMessages: {
      pattern: 'Image must be a valid URL or path to an image file'
    }
  }
}

/**
 * Valida un campo individual
 * @param {string} fieldName - Nombre del campo
 * @param {string} value - Valor a validar
 * @returns {object} - {isValid: boolean, error: string}
 */
export function validateField(fieldName, value) {
  const validation = characterValidations[fieldName]
  if (!validation) {
    return { isValid: true, error: '' }
  }

  const trimmedValue = typeof value === 'string' ? value.trim() : value

  // Validar campo requerido
  if (validation.required && (!trimmedValue || trimmedValue === '')) {
    return {
      isValid: false,
      error: validation.errorMessages.required
    }
  }

  // Si el campo no es requerido y está vacío, es válido
  if (!validation.required && (!trimmedValue || trimmedValue === '')) {
    return { isValid: true, error: '' }
  }

  // Validar longitud mínima
  if (validation.minLength && trimmedValue.length < validation.minLength) {
    return {
      isValid: false,
      error: validation.errorMessages.minLength
    }
  }

  // Validar longitud máxima
  if (validation.maxLength && trimmedValue.length > validation.maxLength) {
    return {
      isValid: false,
      error: validation.errorMessages.maxLength
    }
  }

  // Validar patrón regex
  if (validation.pattern && !validation.pattern.test(trimmedValue)) {
    return {
      isValid: false,
      error: validation.errorMessages.pattern
    }
  }

  // Validar enum
  if (validation.enum && !validation.enum.includes(trimmedValue)) {
    return {
      isValid: false,
      error: validation.errorMessages.enum
    }
  }

  return { isValid: true, error: '' }
}

/**
 * Valida todo el formulario de personaje
 * @param {object} characterData - Datos del personaje
 * @returns {object} - {isValid: boolean, errors: object}
 */
export function validateCharacter(characterData) {
  const errors = {}
  let isValid = true

  Object.keys(characterValidations).forEach(fieldName => {
    const validation = validateField(fieldName, characterData[fieldName])
    if (!validation.isValid) {
      errors[fieldName] = validation.error
      isValid = false
    }
  })

  return { isValid, errors }
}

/**
 * Sanitiza los datos del personaje
 * @param {object} characterData - Datos del personaje
 * @returns {object} - Datos sanitizados
 */
export function sanitizeCharacterData(characterData) {
  const sanitized = {}
  
  Object.keys(characterData).forEach(key => {
    if (typeof characterData[key] === 'string') {
      // Remover espacios extra y caracteres peligrosos
      sanitized[key] = characterData[key]
        .trim()
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    } else {
      sanitized[key] = characterData[key]
    }
  })

  // Establecer imagen por defecto si no se proporciona
  if (!sanitized.image || sanitized.image === '') {
    sanitized.image = '/images/default.jpg'
  }

  return sanitized
}

/**
 * Formatea mensajes de error para mostrar al usuario
 * @param {object} errors - Objeto con errores de validación
 * @returns {string} - Mensaje formateado
 */
export function formatErrorMessage(errors) {
  if (!errors || Object.keys(errors).length === 0) {
    return ''
  }

  const errorMessages = Object.values(errors)
  
  if (errorMessages.length === 1) {
    return errorMessages[0]
  }

  return `Multiple errors found:\n${errorMessages.map(msg => `• ${msg}`).join('\n')}`
}