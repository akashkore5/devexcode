// pages/auth/error.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  // Log the error to the console for debugging (optional, remove in production)
  useEffect(() => {
    if (error) {
      console.log('AuthError: Received error:', decodeURIComponent(error));
    }
  }, [error]);

  const errorMessage = error
    ? decodeURIComponent(error)
    : 'An unknown error occurred during authentication. Please try again or contact support.';

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Authentication Error</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6" role="alert">
          {errorMessage}
        </p>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200"
          aria-label="Return to Home Page"
          disabled={router.isFallback}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// Optional: Add static props for static site generation if needed
export async function getStaticProps() {
  return {
    props: {},
  };
}