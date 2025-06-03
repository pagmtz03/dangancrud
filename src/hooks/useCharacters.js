import { useState, useEffect, useCallback } from 'react'
import { validateCharacter, sanitizeCharacterData, formatErrorMessage } from '@/lib/validations'

/**
 * Custom hook para manejar operaciones CRUD de personajes
 * Implementa principios de código limpio y manejo robusto de errores
 */
export function useCharacters() {
  // Estados principales
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados para el manejo de operaciones específicas
  const [operationLoading, setOperationLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false
  })

  /**
   * Función genérica para manejar errores de API
   */
  const handleApiError = useCallback((error, operation) => {
    console.error(`Error in ${operation}:`, error)
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setError('Network error: Please check your internet connection')
    } else if (error.message) {
      setError(error.message)
    } else {
      setError(`Failed to ${operation}. Please try again.`)
    }
  }, [])

  /**
   * Función para limpiar mensajes después de un tiempo
   */
  const clearMessages = useCallback(() => {
    const timer = setTimeout(() => {
      setError('')
      setSuccess('')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  /**
   * Efecto para limpiar mensajes automáticamente
   */
  useEffect(() => {
    if (error || success) {
      return clearMessages()
    }
  }, [error, success, clearMessages])

  /**
   * Función para actualizar el estado de loading de operaciones específicas
   */
  const setOperationLoadingState = useCallback((operation, isLoading) => {
    setOperationLoading(prev => ({
      ...prev,
      [operation]: isLoading
    }))
    
    // También actualizar el loading general
    setLoading(isLoading)
  }, [])

  /**
   * Realizar petición HTTP con manejo de errores
   */
  const makeApiRequest = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || `HTTP Error: ${response.status}`)
    }

    return result
  }, [])

  /**
   * Obtener todos los personajes
   */
  const fetchCharacters = useCallback(async () => {
    try {
      setOperationLoadingState('fetch', true)
      setError('')

      const result = await makeApiRequest('/api/characters')
      setCharacters(result.data || [])
      
    } catch (err) {
      handleApiError(err, 'fetch characters')
      setCharacters([])
    } finally {
      setOperationLoadingState('fetch', false)
    }
  }, [makeApiRequest, handleApiError, setOperationLoadingState])

  /**
   * Crear un nuevo personaje
   */
  const createCharacter = useCallback(async (characterData) => {
    try {
      setOperationLoadingState('create', true)
      setError('')

      // Validar datos antes de enviar
      const validation = validateCharacter(characterData)
      if (!validation.isValid) {
        setError(formatErrorMessage(validation.errors))
        return { success: false, errors: validation.errors }
      }

      // Sanitizar datos
      const sanitizedData = sanitizeCharacterData(characterData)

      const result = await makeApiRequest('/api/characters', {
        method: 'POST',
        body: JSON.stringify(sanitizedData)
      })

      setSuccess(result.message || 'Character created successfully')
      
      // Actualizar la lista de personajes
      await fetchCharacters()
      
      return { success: true, data: result.data }

    } catch (err) {
      handleApiError(err, 'create character')
      return { success: false, error: err.message }
    } finally {
      setOperationLoadingState('create', false)
    }
  }, [makeApiRequest, handleApiError, setOperationLoadingState, fetchCharacters])

  /**
   * Actualizar un personaje existente
   */
  const updateCharacter = useCallback(async (id, characterData) => {
    try {
      setOperationLoadingState('update', true)
      setError('')

      // Validar datos antes de enviar
      const validation = validateCharacter(characterData)
      if (!validation.isValid) {
        setError(formatErrorMessage(validation.errors))
        return { success: false, errors: validation.errors }
      }

      // Sanitizar datos
      const sanitizedData = sanitizeCharacterData(characterData)

      const result = await makeApiRequest(`/api/characters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sanitizedData)
      })

      setSuccess(result.message || 'Character updated successfully')
      
      // Actualizar la lista de personajes
      await fetchCharacters()
      
      return { success: true, data: result.data }

    } catch (err) {
      handleApiError(err, 'update character')
      return { success: false, error: err.message }
    } finally {
      setOperationLoadingState('update', false)
    }
  }, [makeApiRequest, handleApiError, setOperationLoadingState, fetchCharacters])

  /**
   * Eliminar un personaje
   */
  const deleteCharacter = useCallback(async (id, characterName) => {
    try {
      // Confirmación del usuario
      const confirmed = window.confirm(
        `Are you sure you want to delete "${characterName}"?\n\nThis action cannot be undone.`
      )
      
      if (!confirmed) {
        return { success: false, cancelled: true }
      }

      setOperationLoadingState('delete', true)
      setError('')

      const result = await makeApiRequest(`/api/characters/${id}`, {
        method: 'DELETE'
      })

      setSuccess(result.message || 'Character deleted successfully')
      
      // Actualizar la lista de personajes
      await fetchCharacters()
      
      return { success: true }

    } catch (err) {
      handleApiError(err, 'delete character')
      return { success: false, error: err.message }
    } finally {
      setOperationLoadingState('delete', false)
    }
  }, [makeApiRequest, handleApiError, setOperationLoadingState, fetchCharacters])

  /**
   * Obtener un personaje específico por ID
   */
  const getCharacterById = useCallback(async (id) => {
    try {
      setLoading(true)
      setError('')

      const result = await makeApiRequest(`/api/characters/${id}`)
      return { success: true, data: result.data }

    } catch (err) {
      handleApiError(err, 'fetch character')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [makeApiRequest, handleApiError])

  /**
   * Limpiar todos los mensajes manualmente
   */
  const clearAllMessages = useCallback(() => {
    setError('')
    setSuccess('')
  }, [])

  /**
   * Reiniciar el estado del hook
   */
  const resetState = useCallback(() => {
    setCharacters([])
    setLoading(false)
    setError('')
    setSuccess('')
    setOperationLoading({
      fetch: false,
      create: false,
      update: false,
      delete: false
    })
  }, [])

  // Cargar personajes al montar el componente
  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  return {
    // Estados
    characters,
    loading,
    operationLoading,
    error,
    success,
    
    // Acciones CRUD
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacterById,
    
    // Utilidades
    clearAllMessages,
    resetState
  }
}