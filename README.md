// README.md
# BrixSports Backend API

A comprehensive backend API for a live football web application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🏈 **Multi-Sport Support**: Football, Basketball, and Track Events
- ⚡ **Real-time Updates**: Live scores and match events via Socket.IO
- 📱 **RESTful API**: Complete CRUD operations for all resources
- 📚 **API Documentation**: Interactive Swagger/OpenAPI documentation
- 🗄️ **PostgreSQL Database**: Robust relational database with proper indexing
- 🎯 **TypeScript**: Full type safety and better developer experience
- 🔄 **Real-time Broadcasting**: Live score updates and match events
- ⭐ **User Favorites**: Teams, players, and competitions favorites
- 🏆 **Competition Management**: Multiple competition types and categories

## API Endpoints

### Home & Dashboard
- `GET /api/home` - Get home screen data (live matches, upcoming matches)
- `GET /api/matches/:sport` - Get matches by sport type

### Competitions
- `GET /api/competitions` - Get all competitions
- `GET /api/competitions/:id` - Get competition details with matches
- `POST /api/competitions` - Create new competition

### Teams & Players
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details with players
- `POST /api/teams` - Create new team

### Matches
- `GET /api/matches` - Get matches with filters
- `GET /api/matches/:id` - Get match details with events
- `POST /api/matches` - Create new match

### Live Updates
- `GET /api/live/matches` - Get live matches
- `PATCH /api/live/matches/:id/score` - Update live match score
- `POST /api/live/events` - Add match event (goal, card, etc.)

### Track Events
- `GET /api/track/fixtures` - Get track events fixtures
- `POST /api/track/events` - Create track event
- `PATCH /api/track/events/:id/status` - Update track event status

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

## Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd brixsports-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb brixsports

# Or using psql
psql -c "CREATE DATABASE brixsports;"
```

4. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start development server**
```bash
npm run dev
```

6. **Access the application**
- API Server: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## Database Schema

The application uses PostgreSQL with the following main tables:
- `teams` - Team information
- `competitions` - Competition details
- `matches` - Match data with live scores
- `players` - Player information
- `match_events` - Goals, cards, substitutions
- `track_events` - Track and field events
- `user_favorites` - User's favorite teams, players, competitions

## Real-time Features

### Socket.IO Events
- `join_match` - Join match room for live updates
- `score_update` - Live score changes
- `match_event` - Goals, cards, substitutions
- `match_status` - Match status changes

### Live Updates
The API provides real-time updates for:
- Live match scores
- Match events (goals, cards, substitutions)
- Match status changes (live, completed, etc.)
- Track event updates

## Development Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests
```

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Example requests and responses
- Authentication requirements
- WebSocket event documentation

## Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Set production environment variables**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
```

3. **Start the production server**
```bash
npm start
```