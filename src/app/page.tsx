import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import Testimonials from '@/components/sections/Testimonials'
import Blog from '@/components/sections/Blog'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
      <Blog />
      <About />
      <Contact />
    </div>
  )
}
