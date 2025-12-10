import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@noir.com', label: 'Email' },
  ]

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Have a project in mind?</h3>
            <Link
              href="mailto:hello@noir.com"
              className="text-4xl md:text-6xl font-bold text-white hover:text-primary transition-colors duration-200 block mb-6"
            >
              hello@noir.com
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Ready to bring your ideas to life? Let's create something amazing together.
            </p>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon size={20} className="text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/projects" className="block text-gray-400 hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Noir Portfolio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
