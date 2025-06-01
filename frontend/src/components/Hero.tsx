'use client';

export default function Hero() {
  return (
    <div className="relative">
      {/* AI Robot Illustration Area */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden mb-8">
        <div className="text-center space-y-6">
          {/* Floating Robot Illustration */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            {/* Platform/Base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-2xl shadow-lg"></div>
            
            {/* Robot Body */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl relative">
                {/* Robot Head */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-2xl border-4 border-gray-500">
                  {/* Eyes */}
                  <div className="flex justify-center items-center h-full space-x-2">
                    <div className="w-2 h-1 bg-pink-500 rounded-full"></div>
                    <div className="w-2 h-1 bg-pink-500 rounded-full"></div>
                  </div>
                  {/* Antennae */}
                  <div className="absolute -top-2 left-2 w-1 h-3 bg-gray-400 rounded-full"></div>
                  <div className="absolute -top-2 right-2 w-1 h-3 bg-gray-400 rounded-full"></div>
                  <div className="absolute -top-3 left-2 w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="absolute -top-3 right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                
                {/* Heart/Chest */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>

                {/* Arms */}
                <div className="absolute top-4 -left-3 w-6 h-3 bg-gray-700 rounded-full"></div>
                <div className="absolute top-4 -right-3 w-6 h-3 bg-gray-700 rounded-full"></div>
              </div>
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-blue-400 rotate-45 opacity-60"></div>
            <div className="absolute top-8 right-8 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-16 left-8 w-2 h-6 bg-purple-400 opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Scale Your Finance Operations
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            With the Power of AI
          </span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          EVA, PHIL, and CAM, leading the way in revolutionizing
        </p>

        <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors text-lg">
          Request Demo
        </button>
      </div>
    </div>
  );
} 