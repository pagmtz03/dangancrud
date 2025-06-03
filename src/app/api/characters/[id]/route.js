import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener personaje por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid character ID',
        details: 'Character ID must be a valid number'
      }, { status: 400 })
    }

    const character = await prisma.character.findUnique({
      where: { id }
    })

    if (!character) {
      return NextResponse.json({
        success: false,
        error: 'Character not found',
        details: `No character found with ID: ${id}`
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: character,
      message: 'Character retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching character:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch character',
      details: error.message
    }, { status: 500 })
  }
}

// PUT - Actualizar personaje
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid character ID',
        details: 'Character ID must be a valid number'
      }, { status: 400 })
    }

    // Verificar si el personaje existe
    const existingCharacter = await prisma.character.findUnique({
      where: { id }
    })

    if (!existingCharacter) {
      return NextResponse.json({
        success: false,
        error: 'Character not found',
        details: `No character found with ID: ${id}`
      }, { status: 404 })
    }

    // Verificar si otro personaje ya tiene el mismo nombre
    if (body.name && body.name !== existingCharacter.name) {
      const duplicateName = await prisma.character.findFirst({
        where: { 
          name: body.name,
          id: { not: id }
        }
      })

      if (duplicateName) {
        return NextResponse.json({
          success: false,
          error: 'Character name already exists',
          details: `Another character named "${body.name}" already exists`
        }, { status: 409 })
      }
    }

    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: {
        name: body.name || existingCharacter.name,
        talent: body.talent || existingCharacter.talent,
        gender: body.gender || existingCharacter.gender,
        height: body.height || existingCharacter.height,
        weight: body.weight || existingCharacter.weight,
        birthday: body.birthday || existingCharacter.birthday,
        image: body.image || existingCharacter.image
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCharacter,
      message: 'Character updated successfully'
    })
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update character',
      details: error.message
    }, { status: 500 })
  }
}

// DELETE - Eliminar personaje
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid character ID',
        details: 'Character ID must be a valid number'
      }, { status: 400 })
    }

    // Verificar si el personaje existe
    const existingCharacter = await prisma.character.findUnique({
      where: { id }
    })

    if (!existingCharacter) {
      return NextResponse.json({
        success: false,
        error: 'Character not found',
        details: `No character found with ID: ${id}`
      }, { status: 404 })
    }

    await prisma.character.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Character deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting character:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete character',
      details: error.message
    }, { status: 500 })
  }
}