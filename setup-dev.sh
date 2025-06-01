#!/bin/bash

# CostOptimizer AI Agent - Development Setup Script

echo "🔧 Setting up CostOptimizer AI Agent Development Environment"
echo "=========================================================="

# Create backend virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    cd ..
else
    echo "✅ Python virtual environment already exists"
fi

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file from example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your LYZR API credentials"
else
    echo "✅ Backend .env file already exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file from example..."
    cp frontend/.env.local.example frontend/.env.local
else
    echo "✅ Frontend .env.local file already exists"
fi

# Run Django migrations
echo "🗃️  Running Django migrations..."
cd backend
source venv/bin/activate
python manage.py migrate
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your LYZR API credentials:"
echo "   - LYZR_API_KEY=your_actual_api_key"
echo "   - LYZR_AGENT_ID=your_actual_agent_id"
echo ""
echo "2. Start the development servers:"
echo "   ./start-dev.sh"
echo ""
echo "📱 The app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000" 