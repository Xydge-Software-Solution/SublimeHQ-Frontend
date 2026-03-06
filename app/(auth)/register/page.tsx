'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    console.log('Google signup clicked');
    // When API is ready: window.location.href = '/api/auth/google';
    // For now, redirect to onboarding
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex flex-col">
      {/* Logo */}
      <div className="pt-8 pb-4 flex justify-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Sublime"
            width={120}
            height={40}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              Turn your product into a live storefront in minutes
            </h1>
            
            {/* Description */}
            <p className="text-gray-500 text-center mb-8">
              No complexity. No technical setup. Just sell.
            </p>

            {/* Auth Buttons */}
            <div className="space-y-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">or</span>
                </div>
              </div>

              {/* Email Button */}
              <Link
                href="/register/email"
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-900 rounded-full font-medium text-white hover:bg-gray-800 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with Email
              </Link>
            </div>

            {/* Login Link */}
            <p className="text-center mt-8 text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Login
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-white/70 text-sm mt-6 px-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
