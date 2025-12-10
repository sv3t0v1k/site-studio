import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { emailService } from '@/lib/email/service'

const prisma = new PrismaClient()

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// POST /api/contact - отправить контактное сообщение
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: validatedData,
    })

    // Send email notification
    const emailSent = await emailService.sendContactNotification(contactMessage)
    if (!emailSent) {
      console.warn('Failed to send contact notification email, but message was saved to database')
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: contactMessage,
    })
  } catch (error) {
    console.error('Error sending contact message:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET /api/contact - получить все сообщения (только для админов)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin role

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const read = searchParams.get('read')

    const skip = (page - 1) * limit

    const where = {
      ...(read !== null && { read: read === 'true' }),
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
