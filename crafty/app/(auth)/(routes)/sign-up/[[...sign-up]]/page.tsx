import { SignUp } from '@clerk/nextjs';
import React from 'react';

function CustomSignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            Sign up to get started
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <SignUp
            signInUrl="/sign-in"  // Redirect to your custom sign-in page
            appearance={{
              elements: {
                footer: 'hidden', // Hide the Clerk footer
                card: 'shadow-none border border-gray-200 rounded-lg',
                formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 w-full',
              },
            }}
          />
        </div>

        <div className="text-center">
          <p className="mt-6 text-base text-gray-600">
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomSignUp;
