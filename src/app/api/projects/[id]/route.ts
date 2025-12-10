import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// GET /api/projects/[id] - получить проект по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse JSON strings back to arrays for SQLite compatibility
    const processedProject = {
      ...project,
      images: JSON.parse(project.images || '[]'),
      technologies: JSON.parse(project.technologies || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: processedProject,
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - обновить проект (только для админов)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    const body = await request.json()

    const projectSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      category: z.string().min(1).optional(),
      image: z.string().url().optional(),
      images: z.array(z.string().url()).optional(),
      client: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      url: z.string().url().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    })

    const validatedData = projectSchema.parse(body)

    // Generate slug if title is being updated
    const updateData: any = { ...validatedData }
    if (validatedData.title) {
      updateData.slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Convert arrays to JSON strings for SQLite compatibility
    if (validatedData.images) {
      updateData.images = JSON.stringify(validatedData.images)
    }
    if (validatedData.technologies) {
      updateData.technologies = JSON.stringify(validatedData.technologies)
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    })

    // Parse JSON strings back to arrays for response
    const responseProject = {
      ...project,
      images: JSON.parse(project.images || '[]'),
      technologies: JSON.parse(project.technologies || '[]'),
    }

    return NextResponse.json({
      success: true,
      data: responseProject,
    })
  } catch (error) {
    console.error('Error updating project:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - удалить проект (только для админов)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
