import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { hashPassword, validatePassword } from '@/lib/auth/password'
import { createAuthToken } from '@/lib/auth/jwt'

const prisma = new PrismaClient()

const setupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'System already initialized' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = setupSchema.parse(body)

    // Validate password strength
    const passwordValidation = validatePassword(validatedData.password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password validation failed',
          details: passwordValidation.errors,
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    // Create JWT token
    const token = createAuthToken(adminUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = adminUser

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: userWithoutPassword,
        token,
      },
    })
  } catch (error) {
    console.error('Setup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Setup failed' },
      { status: 500 }
    )
  }
}
