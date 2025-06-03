'use client'
import { useState, useEffect } from 'react'
import '../danganstyles.css'

interface Character {
  id: number
  name: string
  talent: string
  gender: string
  height: string
  weight: string
  birthday: string
  image: string
}

interface FormData {
  name: string
  talent: string
  gender: string
  height: string
  weight: string
  birthday: string
  image: string
}

interface Modal {
  isOpen: boolean
  type: 'add' | 'edit' | ''
  character: Character | null
}

const CharacterCrud = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modal, setModal] = useState<Modal>({
    isOpen: false,
    type: '',
    character: null
  })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    talent: '',
    gender: '',
    height: '',
    weight: '',
    birthday: '',
    image: ''
  })

  // Cargar personajes al montar el componente
  useEffect(() => {
    fetchCharacters()
  }, [])

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const fetchCharacters = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/characters')
      const result = await response.json()
      
      if (result.success) {
        setCharacters(result.data || [])
      } else {
        setError(result.error || 'Failed to fetch characters')
      }
    } catch (err) {
      setError('Network error: Unable to fetch characters')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      talent: '',
      gender: '',
      height: '',
      weight: '',
      birthday: '',
      image: ''
    })
  }

  const toggleModal = (type: 'add' | 'edit' | '', character?: Character) => {
    setModal({ isOpen: !modal.isOpen, type, character: character || null })
    if (type === 'edit' && character) {
      setFormData({
        name: character.name,
        talent: character.talent,
        gender: character.gender,
        height: character.height,
        weight: character.weight,
        birthday: character.birthday,
        image: character.image
      })
    } else if (type === 'add') {
      resetForm()
    }
    setError('')
    setSuccess('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    const requiredFields = ['name', 'talent', 'gender', 'height', 'weight', 'birthday']
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim())
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const url = modal.type === 'edit' && modal.character
        ? `/api/characters/${modal.character.id}`
        : '/api/characters'
      
      const method = modal.type === 'edit' ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: formData.image || '/images/default.jpg'
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(result.message || `Character ${modal.type === 'edit' ? 'updated' : 'created'} successfully`)
        toggleModal('')
        await fetchCharacters()
      } else {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('Network error: Unable to save character')
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este personaje?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(result.message || 'Character deleted successfully')
        await fetchCharacters()
      } else {
        setError(result.error || 'Failed to delete character')
      }
    } catch (err) {
      setError('Network error: Unable to delete character')
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '1rem' }}>
      <h1 className="text-center" style={{ marginBottom: '1.5rem' }}>
        Danganronpa V3: Killing Harmony Characters
      </h1>
      
      {/* Alert Messages */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          <strong>Success:</strong> {success}
        </div>
      )}
      
      <div className="btn-center">
        <button 
          className="btn btn-success"
          onClick={() => toggleModal('add')}
          disabled={loading}
        >
          Add Character
        </button>
      </div>
      
      <table className="table table-striped table-bordered table-hover" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Talent</th>
            <th>Gender</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Birthday</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map(character => (
            <tr key={character.id}>
              <td>{character.id}</td>
              <td>
                <img 
                  src={character.image} 
                  alt={character.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/default.jpg'
                  }}
                />
              </td>
              <td>{character.name}</td>
              <td>{character.talent}</td>
              <td>{character.gender}</td>
              <td>{character.height}</td>
              <td>{character.weight}</td>
              <td>{character.birthday}</td>
              <td>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => toggleModal('edit', character)}
                  disabled={loading}
                  style={{ marginRight: '0.25rem' }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(character.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modal.isOpen && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modal.type === 'edit' ? 'Edit Character' : 'Add Character'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => toggleModal('')}
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Talent</label>
                      <input
                        type="text"
                        name="talent"
                        className="form-control"
                        value={formData.talent}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        name="gender"
                        className="form-control"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Height</label>
                      <input
                        type="text"
                        name="height"
                        className="form-control"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g., 171 cm"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Weight</label>
                      <input
                        type="text"
                        name="weight"
                        className="form-control"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 58 kg"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Birthday</label>
                      <input
                        type="text"
                        name="birthday"
                        className="form-control"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        placeholder="e.g., September 7"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="url"
                        name="image"
                        className="form-control"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="/images/character.jpg"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => toggleModal('')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CharacterCrud