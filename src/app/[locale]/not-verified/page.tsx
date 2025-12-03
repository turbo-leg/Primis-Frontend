'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function NotVerifiedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setStatus('idle');
    
    try {
      // We send a dummy name because the backend schema expects UserBase (name, email)
      await apiClient.post('/api/v1/auth/resend-verification', { name: 'User', email });
      setStatus('success');
      setMessage('Verification email has been sent. Please check your inbox.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
            <CardDescription className="text-center">
              No email address provided. Please try logging in again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button>Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Email Not Verified</CardTitle>
          <CardDescription className="text-center mt-2">
            Your account is not yet verified. We sent a verification link to <strong>{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{message}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-sm text-gray-500 text-center mb-4">
            Please check your email (including spam folder) for the verification link.
            If you didn't receive it, you can request a new one below.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full" 
            onClick={handleResend} 
            disabled={isLoading || status === 'success'}
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
            {!isLoading && <Mail className="ml-2 h-4 w-4" />}
          </Button>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">Back to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function NotVerifiedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotVerifiedContent />
    </Suspense>
  );
}
