'use client';

export default function AIAssistants() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100 rounded-3xl"></div>
      <div className="absolute inset-[1px] bg-white rounded-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header with window controls */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Assistants</h3>
            <p className="text-gray-600 text-sm">EVA, PHIL, and CAM, leading the way in revolutionizing</p>
          </div>

          {/* Kelly badge */}
          <div className="inline-flex">
            <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Kelly
            </span>
          </div>
        </div>
      </div>

      {/* Triangle pointer */}
      <div className="absolute bottom-0 left-8 transform translate-y-1/2">
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-pink-500"></div>
      </div>
    </div>
  );
} 