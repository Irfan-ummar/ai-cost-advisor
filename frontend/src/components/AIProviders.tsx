'use client';

export default function AIProviders() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="text-center space-y-6">
        {/* User Avatars with Connection Lines */}
        <div className="relative">
          {/* Patient Side */}
          <div className="absolute left-0 top-0 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-2 mx-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=64&h=64&fit=crop&crop=face" 
                  alt="Patient"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mx-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" 
                  alt="Patient 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Patient</p>
          </div>

          {/* Center Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          {/* Providers Side */}
          <div className="absolute right-0 top-0 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-2 mx-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face" 
                  alt="Provider"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mx-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=48&h=48&fit=crop&crop=face" 
                  alt="Provider 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Providers</p>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
            <defs>
              <pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#e5e7eb"/>
              </pattern>
            </defs>
            <path
              d="M 60 40 Q 120 20 180 40"
              stroke="url(#dots)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,2"
            />
            <path
              d="M 60 80 Q 120 100 180 80"
              stroke="url(#dots)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,2"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="pt-16">
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI for Providers</h3>
          <p className="text-gray-600 text-sm mb-6">EVA, PHIL, and CAM, leading the way in revolutionizing</p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Request Demo
          </button>
        </div>
      </div>
    </div>
  );
} 