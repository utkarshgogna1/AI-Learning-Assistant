import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Page Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sorry, the page you are looking for might have been moved or doesn't exist.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="inline-block ml-4 px-6 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
} 