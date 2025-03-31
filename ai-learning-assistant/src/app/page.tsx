import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          AI Learning Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your personal AI-powered learning companion that adapts to your needs and helps you master new skills more effectively.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link 
            href="/login"
            className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 text-lg font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-blue-400 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create Account
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personalized Learning</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Custom learning plans tailored to your goals, learning style, and pace.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Feedback</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Receive intelligent suggestions and adaptive feedback to improve your learning.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Track Progress</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your learning journey with detailed analytics and progress reports.
            </p>
          </div>
        </div>
        
        <footer className="text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} AI Learning Assistant. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
