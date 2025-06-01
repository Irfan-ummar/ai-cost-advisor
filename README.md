# CostOptimizer AI Agent - MVP

An anonymous, single-session chat application that provides AI-powered cost optimization guidance for AI/ML projects. Built with Django Channels (WebSocket) backend and Next.js frontend.

## 🏗️ Architecture

- **Backend**: Django + Channels with in-memory WebSocket support
- **Frontend**: Next.js + Tailwind CSS
- **AI Integration**: LyZR API for cost optimization guidance
- **Database**: SQLite (development)
- **Session Management**: Django sessions with cookies

## ✨ Features

- Anonymous chat sessions (no login required)
- Real-time WebSocket streaming responses
- Deck-style card rendering for numbered sections
- Credit usage tracking and warnings
- Mobile-responsive design
- Auto-reconnection for WebSocket disconnections

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Setup

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd ai-cost-advisor
   ./setup-dev.sh
   ```

2. **Configure environment variables:**
   
   Update `backend/.env` with your LyZR credentials:
   ```bash
   LYZR_API_KEY=your_actual_api_key
   LYZR_AGENT_ID=your_actual_agent_id
   ```

3. **Start development servers:**
   ```bash
   ./start-dev.sh
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
ai-cost-advisor/
├── backend/                 # Django backend
│   ├── costoptimizer/      # Main Django project
│   ├── chat/               # Chat app with WebSocket consumer
│   ├── venv/               # Python virtual environment
│   ├── .env                # Environment variables (not in git)
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── pages/          # Next.js pages
│   ├── .env.local          # Frontend environment (not in git)
│   └── package.json        # Node.js dependencies
├── .gitignore              # Git ignore rules
├── setup-dev.sh            # Development setup script
└── start-dev.sh            # Development start script
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python manage.py migrate
python manage.py runserver 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```bash
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
LYZR_API_KEY=your_lyzr_api_key
LYZR_AGENT_ID=your_lyzr_agent_id
LYZR_AGENT_NAME=CostOptimizer
DEFAULT_CREDIT_THRESHOLD=25000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=ws://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 API Endpoints

### WebSocket
- `ws://localhost:8000/ws/chat/` - Main chat WebSocket connection

### HTTP
- `GET /api/health/` - Health check endpoint

## 🎯 Key Features Implemented

### Chat Interface
- Real-time streaming responses via WebSocket
- "Typing..." indicator during AI processing
- Auto-scroll to new messages
- Mobile-responsive design

### Deck-Style Rendering
- Automatic detection of numbered sections (1., 2., etc.)
- Each section rendered as individual cards
- Navigation between cards
- Responsive card layout

### Credit Management
- Token usage estimation and tracking
- Warning banner at 80% usage
- Input disabled at 100% usage
- Session-based credit tracking

### Error Handling
- WebSocket reconnection logic
- API error handling with user-friendly messages
- Connection status indicators

## 🔒 Security Features

- CORS protection
- Secure session cookies
- Environment variable protection
- Input sanitization

## 📊 Session Management

- Anonymous sessions (no user registration)
- Session data stored in Django sessions
- 14-day session expiry
- Chat history preserved until session expires

## 🛠️ Development Notes

### In-Memory Channels
This MVP uses Django Channels with in-memory backend for simplicity. This means:
- ✅ No Redis dependency
- ✅ Easier local development
- ⚠️ Chat sessions don't persist across server restarts
- ⚠️ Limited to single-server deployment

For production, consider upgrading to Redis-backed channels for:
- Multi-server support
- Session persistence
- Better scalability

### Token Estimation
The system uses a simple heuristic for token estimation:
```python
tokens = max(len(text) // 4, 1)
```

This may not be 100% accurate but provides a reasonable approximation for credit tracking.

## 🚀 Deployment

For production deployment:

1. Update environment variables for production
2. Set `DEBUG=False`
3. Configure proper database (PostgreSQL recommended)
4. Set up proper web server (nginx + gunicorn)
5. Configure Redis for production channels layer
6. Enable HTTPS/WSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the CostOptimizer AI Agent MVP as defined in the Product Requirements Document (PRD).

---

For detailed technical specifications, refer to the PRD document in `.cursorrules`.