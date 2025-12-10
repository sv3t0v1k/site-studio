import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    })

    return NextResponse.json({
      success: true,
      hasAdmin: adminCount > 0,
    })
  } catch (error) {
    console.error('Check setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check setup status' },
      { status: 500 }
    )
  }
}
