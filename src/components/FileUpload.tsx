'use client'

import { useState } from 'react'
import { uploadFile } from '@/lib/upload'
import { Input } from '@/components/ui/input'

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setMessage(null)
      const downloadURL = await uploadFile(file)
      
      setMessage({
        type: 'success',
        text: 'File uploaded successfully to Firebase Storage.'
      })

      // You can save the downloadURL to your database here
      console.log('File uploaded:', downloadURL)
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'There was an error uploading your file. Please try again.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={handleFileUpload}
        disabled={isUploading}
        accept=".pdf,.doc,.docx,.txt"  // Adjust accepted file types as needed
      />
      {isUploading && (
        <div className="text-sm text-muted-foreground">
          Uploading file...
        </div>
      )}
      {message && (
        <div className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}