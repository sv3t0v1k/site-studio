import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth/password'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default admin user if it doesn't exist
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  })

  if (!adminExists) {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123')
    const admin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@noir.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('✅ Created admin user:', admin.email)
  } else {
    console.log('ℹ️ Admin user already exists')
  }

  // Create sample services
  const servicesData = [
    {
      title: 'Brand Identity Design',
      description: 'Blend of strategic thinking and creative flair to craft a digital identity that resonates and captivates.',
      icon: 'ri-palette-line',
      order: 1,
    },
    {
      title: 'Visual Design',
      description: 'Blend of artistic intuition with strategic insight to craft a visual identity.',
      icon: 'ri-brush-line',
      order: 2,
    },
    {
      title: 'UX Research',
      description: 'Blend of functionality with aesthetics to create delightful experience.',
      icon: 'ri-search-line',
      order: 3,
    },
    {
      title: 'Art Direction',
      description: 'Blend of strategic thinking and creative flair to craft a digital identity that resonates and captivates.',
      icon: 'ri-compass-line',
      order: 4,
    },
  ]

  for (const service of servicesData) {
    const existingService = await prisma.service.findFirst({
      where: { title: service.title },
    })

    if (!existingService) {
      await prisma.service.create({
        data: service,
      })
      console.log(`✅ Created service: ${service.title}`)
    }
  }

  // Create sample testimonials
  const testimonialsData = [
    {
      name: 'Zonathon Doe',
      position: 'CEO & Founder',
      company: 'Company X',
      content: 'Financial planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
      avatar: '/images/testimonials/author1.jpg',
      rating: 5,
    },
    {
      name: 'Martin Smith',
      position: 'CEO & Founder',
      company: 'Google',
      content: 'Asian planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
      avatar: '/images/testimonials/author2.jpg',
      rating: 5,
    },
    {
      name: 'Methail Dev',
      position: 'Managing Director',
      company: 'Paydesk',
      content: 'Hello planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
      avatar: '/images/testimonials/author3.jpg',
      rating: 5,
    },
  ]

  for (const testimonial of testimonialsData) {
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { name: testimonial.name },
    })

    if (!existingTestimonial) {
      await prisma.testimonial.create({
        data: testimonial,
      })
      console.log(`✅ Created testimonial: ${testimonial.name}`)
    }
  }

  // Create sample projects
  const projectsData = [
    {
      title: 'Glasses of Cocktail',
      slug: 'glasses-of-cocktail',
      description: 'A premium branding project for a cocktail lounge featuring elegant glassware design.',
      category: 'Branding',
      image: '/images/projects/work1.jpg',
      images: JSON.stringify(['/images/projects/work1.jpg']),
      client: 'Cocktail Lounge Co.',
      technologies: JSON.stringify(['Adobe Illustrator', 'Photoshop', 'InDesign']),
      featured: true,
      published: true,
    },
    {
      title: 'A Branch with Flowers',
      slug: 'branch-with-flowers',
      description: 'Nature-inspired design project showcasing floral arrangements and botanical illustrations.',
      category: 'Mockup',
      image: '/images/projects/work2.jpg',
      images: JSON.stringify(['/images/projects/work2.jpg']),
      technologies: JSON.stringify(['Procreate', 'Adobe Photoshop', 'Illustrator']),
      featured: true,
      published: true,
    },
    {
      title: 'Orange Rose Flower',
      slug: 'orange-rose-flower',
      description: 'Vibrant floral design with cinematic video presentation.',
      category: 'Video',
      image: '/images/projects/work3.jpg',
      images: JSON.stringify(['/images/projects/work3.jpg']),
      technologies: JSON.stringify(['After Effects', 'Cinema 4D', 'Adobe Premiere']),
      featured: false,
      published: true,
    },
  ]

  for (const project of projectsData) {
    const existingProject = await prisma.project.findUnique({
      where: { slug: project.slug },
    })

    if (!existingProject) {
      await prisma.project.create({
        data: project,
      })
      console.log(`✅ Created project: ${project.title}`)
    }
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
