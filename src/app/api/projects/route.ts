import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// GET /api/projects - получить все проекты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const published = searchParams.get('published') !== 'false' // default true

    const skip = (page - 1) * limit

    const where = {
      ...(category && { category }),
      ...(featured && { featured: true }),
      ...(published && { published: true }),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ])

    // Parse JSON strings back to arrays for SQLite compatibility
    const processedProjects = projects.map(project => ({
      ...project,
      images: JSON.parse(project.images || '[]'),
      technologies: JSON.parse(project.technologies || '[]'),
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: processedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - создать новый проект (только для админов)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json()

    const projectSchema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string().min(1),
      image: z.string().url(),
      images: z.array(z.string().url()).default([]),
      client: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      url: z.string().url().optional(),
      featured: z.boolean().default(false),
      published: z.boolean().default(false),
    })

    const validatedData = projectSchema.parse(body)

    const validatedData = projectSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Convert arrays to JSON strings for SQLite compatibility
    const projectData = {
      ...validatedData,
      slug,
      images: JSON.stringify(validatedData.images),
      technologies: JSON.stringify(validatedData.technologies),
    }

    const project = await prisma.project.create({
      data: projectData,
    })

    // Convert back to arrays for response
    const responseProject = {
      ...project,
      images: JSON.parse(project.images),
      technologies: JSON.parse(project.technologies),
    }

    return NextResponse.json({
      success: true,
      data: responseProject,
    })
  } catch (error) {
    console.error('Error creating project:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
