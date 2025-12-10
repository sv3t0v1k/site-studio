import nodemailer from 'nodemailer'
import { ContactMessage } from '@/types'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor(config?: EmailConfig) {
    this.transporter = nodemailer.createTransporter({
      host: config?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: config?.port || parseInt(process.env.SMTP_PORT || '587'),
      secure: config?.secure || process.env.SMTP_SECURE === 'true',
      auth: {
        user: config?.user || process.env.SMTP_USER,
        pass: config?.pass || process.env.SMTP_PASS,
      },
    })
  }

  async sendContactNotification(message: ContactMessage): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@noir.com',
        to: process.env.ADMIN_EMAIL || 'admin@noir.com',
        subject: `New Contact Form Submission: ${message.subject}`,
        html: this.generateContactEmailHTML(message),
      }

      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Failed to send contact notification email:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@noir.com',
        to: email,
        subject: 'Welcome to Noir Portfolio',
        html: this.generateWelcomeEmailHTML(name),
      }

      await this.transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      return false
    }
  }

  private generateContactEmailHTML(message: ContactMessage): string {
    return `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #d5d5d5; padding: 20px;">
        <div style="background: #111; padding: 30px; border-radius: 12px; border: 1px solid #333;">
          <h1 style="color: #ee4818; margin-bottom: 30px; font-size: 24px; text-align: center;">
            New Contact Form Submission
          </h1>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ee4818; margin-bottom: 15px;">Contact Details</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${message.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${message.email}" style="color: #ee4818;">${message.email}</a></p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${message.subject}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px;">
            <h2 style="color: #ee4818; margin-bottom: 15px;">Message</h2>
            <div style="background: #000; padding: 15px; border-radius: 6px; border-left: 4px solid #ee4818;">
              ${message.message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px;">
              This message was sent from your Noir Portfolio contact form.
            </p>
          </div>
        </div>
      </div>
    `
  }

  private generateWelcomeEmailHTML(name: string): string {
    return `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #d5d5d5; padding: 20px;">
        <div style="background: #111; padding: 30px; border-radius: 12px; border: 1px solid #333; text-align: center;">
          <h1 style="color: #ee4818; margin-bottom: 20px; font-size: 28px;">
            Welcome to Noir Portfolio
          </h1>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Hi ${name},<br><br>
            Thank you for joining Noir Portfolio! Your admin account has been successfully created.
          </p>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">You can now access the admin panel to manage your portfolio content.</p>
          </div>

          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin"
             style="display: inline-block; background: #ee4818; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Go to Admin Panel
          </a>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 12px;">
              If you have any questions, feel free to contact us.
            </p>
          </div>
        </div>
      </div>
    `
  }

  // Test email configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('Email configuration test failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()
export default EmailService
