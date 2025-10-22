'use client'

import { Card } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">About Primis</h1>
      
      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            Primis is dedicated to revolutionizing education through innovative technology and personalized learning experiences.
            We believe in making quality education accessible to everyone, everywhere.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Engage with our dynamic course content designed to make learning both effective and enjoyable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from experienced professionals who are passionate about education.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Flexible Schedule</h3>
              <p className="text-muted-foreground">
                Study at your own pace with our flexible course schedules.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Continuously improving our platform with cutting-edge educational technology.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                Making quality education available to students from all backgrounds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                Maintaining high standards in both our content and delivery methods.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}