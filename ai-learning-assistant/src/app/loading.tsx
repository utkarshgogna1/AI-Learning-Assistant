export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Loading your personalized learning experience...
        </p>
        <div className="relative w-full h-4 bg-gray-200 rounded dark:bg-gray-700 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 animate-pulse" style={{ width: '90%' }}></div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    </div>
  );
} 