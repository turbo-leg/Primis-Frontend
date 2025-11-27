'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { apiClient as api } from '@/lib/api';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  template_type: z.string().min(1, 'Please select a template type'),
});

type FormValues = z.infer<typeof formSchema>;

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      template_type: 'welcome',
    },
  });

  const templateType = watch('template_type');

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await api.post('/api/v1/admin/test-email', data);
      toast.success(`Test email (${data.template_type}) sent to ${data.email}`);
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast.error(error.response?.data?.detail || 'Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Testing</h1>
        <p className="text-muted-foreground">
          Send test emails to verify your SMTP configuration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>
            Choose a template and recipient to test the email service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                placeholder="test@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="template_type">Template Type</Label>
              <Select
                onValueChange={(value) => setValue('template_type', value)}
                defaultValue={templateType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="verification">Verification Email</SelectItem>
                  <SelectItem value="reset_password">Password Reset</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              {errors.template_type && (
                <p className="text-sm text-red-500">{errors.template_type.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
