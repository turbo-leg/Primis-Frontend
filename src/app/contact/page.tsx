'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success - clear form
      setFormData({ name: '', email: '', subject: '', message: '' })
      alert('Message sent successfully! We\'ll get back to you soon.')
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primis-navy to-primis-blue bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? We&apos;re here to help. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Send className="h-6 w-6 text-primis-navy" />
                <h2 className="text-2xl font-semibold">Send Us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john.doe@example.com"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-8 bg-primis-navy hover:bg-primis-navy/90"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-full bg-primis-navy/10">
                    <Mail className="w-4 h-4 text-primis-navy" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:info@primis.edu" className="text-sm text-muted-foreground hover:text-primis-navy transition-colors">
                      info@primis.edu
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-full bg-primis-navy/10">
                    <Phone className="w-4 h-4 text-primis-navy" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-primis-navy transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-full bg-primis-navy/10">
                    <MapPin className="w-4 h-4 text-primis-navy" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Education Street<br />
                      Learning City, ED 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Hours */}
            <Card className="p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primis-navy" />
                <h3 className="text-xl font-semibold">Office Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium">Monday - Friday</span>
                  <span className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm font-medium">Saturday</span>
                  <span className="text-sm text-muted-foreground">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sunday</span>
                  <span className="text-sm text-red-500">Closed</span>
                </div>
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="p-6 bg-primis-navy text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-white/80 mb-4">
                For urgent matters, please call us directly during office hours.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                asChild
              >
                <a href="tel:+15551234567">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}