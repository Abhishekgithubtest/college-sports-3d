# College Sports Scoring & Live Update Management System

## Overview
A real-time 3D college sports scoring platform with live match updates, team rankings, player statistics, and immersive 3D visualizations. Built for basketball, football, and cricket with WebSocket-powered real-time broadcasting.

## Current State
**Status:** ✅ MVP Complete and Running
**Last Updated:** November 23, 2025

## Features Implemented

### Core Features
- **3D Interactive Stadium**: Three.js-powered 3D stadium visualization with camera controls and sport-specific courts/fields
- **Live Score Updates**: Real-time score broadcasting via WebSocket with instant updates across all connected clients
- **Animated 3D Scoreboard**: Dynamic scoreboard with score change animations and live match status
- **3D Rankings Podium**: Interactive 3D podium showing top 3 teams with medal indicators
- **Flip Player Cards**: 3D rotating player cards with stats on the back
- **Match Schedule Management**: Calendar view with upcoming, live, and completed matches
- **Player Statistics**: Comprehensive player stats with top scorers leaderboard

### Role-Based Dashboards
1. **Viewer Dashboard** (Public)
   - Live match viewing with 3D visualizations
   - Team rankings with 3D podium
   - Player statistics and leaderboards
   - Match schedule with filtering

2. **Referee Dashboard**
   - Live score entry with +/- controls
   - Real-time match event recording (goals, points)
   - Match start/end controls
   - Quick actions for both teams

3. **Admin Dashboard**
   - Sports management (create sports types)
   - Team management (add teams, assign colors)
   - Player management (roster control)
   - Match scheduling

### Technical Features
- **Real-time Updates**: WebSocket integration for instant score broadcasts
- **Responsive Design**: Mobile-optimized with touch gestures
- **Dark Mode**: Full dark/light theme support
- **Athletic Design**: Rajdhani display font, Inter body font, vibrant sports colors
- **3D Animations**: Smooth camera transitions, particle effects, hover interactions

## Project Structure

### Frontend (`client/src/`)
```
components/
  ├── ThreeScene.tsx          # Base Three.js canvas wrapper
  ├── Stadium3D.tsx           # 3D stadium with interactive camera
  ├── Scoreboard3D.tsx        # Animated 3D scoreboard
  ├── Podium3D.tsx            # 3D rankings podium
  ├── PlayerCard3D.tsx        # Flip card with player stats
  ├── LiveMatchCard.tsx       # Match display card
  ├── Header.tsx              # Navigation
  └── ThemeToggle.tsx         # Dark mode toggle

pages/
  ├── Dashboard.tsx           # Main dashboard with 3D hero
  ├── LiveMatch.tsx           # Individual match page
  ├── Rankings.tsx            # Team rankings with podium
  ├── Schedule.tsx            # Match schedule
  ├── Players.tsx             # Player statistics
  ├── AdminDashboard.tsx      # Admin panel
  └── RefereeDashboard.tsx    # Referee scoring interface

hooks/
  └── use-websocket.ts        # WebSocket connection manager
```

### Backend (`server/`)
```
├── routes.ts     # API endpoints + WebSocket server
├── storage.ts    # In-memory storage with full CRUD
├── seed.ts       # Sample data initialization
└── app.ts        # Express server setup
```

### Shared (`shared/`)
```
└── schema.ts     # Drizzle schemas, Zod validation, TypeScript types
```

## Data Models

### Core Entities
- **Sports**: Basketball, Football, Cricket (type, max players, scoring type)
- **Teams**: Name, color, wins/losses/points
- **Players**: Name, number, position, stats (points, goals, games played)
- **Matches**: Teams, scores, status (scheduled/live/completed), venue, time
- **Match Events**: Goals, points, fouls with timestamps

### Business Logic
- **Match Completion**: Automatically updates team records and player stats
- **Ranking Calculation**: Points-based system (3 for win, 1 for draw)
- **Real-time Broadcasting**: WebSocket events for all score/status changes

## API Endpoints

### Sports
- `GET /api/sports` - List all sports
- `GET /api/sports/:id` - Get sport details
- `POST /api/sports` - Create sport (admin)

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team (admin)

### Players
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get player details
- `POST /api/players` - Create player (admin)

### Matches
- `GET /api/matches` - List all matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches` - Schedule match (admin)
- `PATCH /api/matches/:id` - Update match status (referee)
- `PATCH /api/matches/:id/score` - Update score (referee)
- `PATCH /api/matches/:id/end` - End match (referee)

### Match Events
- `GET /api/matches/:id/events` - Get match timeline
- `POST /api/match-events` - Record event (referee)

## WebSocket Events

### Broadcasted Events
- `match:score` - Score updated
- `match:updated` - Match status changed
- `match:completed` - Match finished
- `teams:updated` - Team records changed
- `players:updated` - Player stats changed
- `event:created` - New match event
- `sport:created` - New sport added
- `team:created` - New team added
- `player:created` - New player added
- `match:created` - New match scheduled

## Design System

### Colors
- **Primary**: Blue (#0091FF) - Sports energy
- **Accent**: Orange (#FF8A3D) - Action highlights
- **Background**: Light gray (light mode), Dark blue-gray (dark mode)
- **Team Colors**: Custom per team (displayed in badges, cards, etc.)

### Typography
- **Display**: Rajdhani (bold, athletic)
- **Body**: Inter (clean, readable)
- **Sizes**: 3xl-8xl for scores, 2xl-3xl for headings

### Components
- **Cards**: Rounded corners, subtle elevation, hover effects
- **Buttons**: Size variants (default, sm, lg, icon)
- **Badges**: Live indicators, status labels, team info
- **3D Elements**: Smooth animations, mouse parallax

## Development Setup

### Prerequisites
- Node.js 20+
- npm

### Installation
1. Dependencies are auto-installed
2. Server starts on port 5000
3. Seed data auto-populated

### Running
```bash
npm run dev
```
Starts both frontend (Vite) and backend (Express) on port 5000

### Sample Data
- 3 Sports: Basketball, Football, Cricket
- 6 Teams: Tigers, Lions, Eagles, Wolves, Knights, Warriors
- 15+ Players across teams
- 4 Matches (1 completed, 1 live demo, 2 scheduled)

## Key Technologies
- **Frontend**: React 18, Wouter (routing), TanStack Query, Three.js
- **Backend**: Express, Socket.io, Drizzle ORM
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Real-time**: WebSocket (Socket.io)
- **State**: React Query with automatic cache invalidation

## User Workflows

### Viewer Journey
1. Land on dashboard with 3D stadium hero
2. See live matches with pulsing "LIVE" badges
3. Click match to view detailed 3D scoreboard and timeline
4. Check rankings on 3D podium
5. Browse player cards with flip animations

### Referee Journey
1. Navigate to referee dashboard
2. Select live or scheduled match
3. Start match (status → live)
4. Update scores with +/- controls
5. Record events (goals, points) for specific players
6. End match (triggers rankings update)

### Admin Journey
1. Access admin dashboard
2. Create sports, teams, players
3. Schedule matches with date/time/venue
4. Monitor all matches and stats

## Performance Optimizations
- **Query Caching**: TanStack Query with infinite stale time
- **WebSocket**: Efficient real-time updates without polling
- **3D Rendering**: RequestAnimationFrame loops, optimized geometry
- **Lazy Loading**: Component-level code splitting via routes

## Future Enhancements (Not in MVP)
- PostgreSQL persistence
- Photo uploads for teams/players
- Match highlights/replay
- Advanced analytics dashboards
- Push notifications
- Multi-tournament support
- Live chat/commentary
- VR/AR match viewing

## Notes
- In-memory storage resets on server restart
- WebSocket connection auto-reconnects on disconnect
- Query keys use join("/") for nested resources (e.g., `/api/matches/${id}`)
- Dark mode persists via localStorage
