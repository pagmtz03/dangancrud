// src/app/api/characters/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los personajes
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { id: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      data: characters,
      message: 'Characters retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch characters',
      details: error.message
    }, { status: 500 })
  }
}

// POST - Crear nuevo personaje
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validación básica
    const requiredFields = ['name', 'talent', 'gender', 'height', 'weight', 'birthday']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        details: `Required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Verificar si el personaje ya existe
    const existingCharacter = await prisma.character.findFirst({
      where: { name: body.name }
    })

    if (existingCharacter) {
      return NextResponse.json({
        success: false,
        error: 'Character already exists',
        details: `A character named "${body.name}" already exists`
      }, { status: 409 })
    }

    const newCharacter = await prisma.character.create({
      data: {
        name: body.name,
        talent: body.talent,
        gender: body.gender,
        height: body.height,
        weight: body.weight,
        birthday: body.birthday,
        image: body.image || '/images/default.jpg'
      }
    })

    return NextResponse.json({
      success: true,
      data: newCharacter,
      message: 'Character created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create character',
      details: error.message
    }, { status: 500 })
  }
}