#!/bin/bash

# CostOptimizer AI Agent - Development Startup Script

echo "🚀 Starting CostOptimizer AI Agent Development Environment"
echo "=================================================="

echo "📋 Using in-memory WebSocket channels (no Redis required)"

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting Django backend..."
cd backend
source venv/bin/activate
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Services started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "🏥 Health:   http://localhost:8000/api/health/"
echo ""
echo "💡 Note: Using in-memory channels - chat sessions won't persist across server restarts"
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait 