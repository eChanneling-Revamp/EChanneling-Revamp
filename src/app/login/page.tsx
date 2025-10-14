"use client";

import { LoginLayout } from '@/components/auth';

export default function LoginPage() {
  const handleLoginSuccess = () => {
    console.log('Login successful!');
    // Additional success handling can be added here
  };

  return <LoginLayout onLoginSuccess={handleLoginSuccess} />;
}
