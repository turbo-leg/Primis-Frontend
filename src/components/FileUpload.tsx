'use client'

import { useState } from 'react'
import { uploadFile } from '@/lib/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const downloadURL = await uploadFile(file)
      
      toast({
        title: "File uploaded successfully",
        description: "The file has been uploaded to Firebase Storage.",
      })

      // You can save the downloadURL to your database here
      console.log('File uploaded:', downloadURL)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
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
    </div>
  )
}