# College Sports Scoring & Live Update Management System

A real-time 3D college sports scoring platform with live match updates, team rankings, player statistics, and immersive Three.js visualizations.

## Features

- **3D Interactive Stadium** with camera controls
- **Live Score Updates** via WebSocket (Socket.io)
- **Animated 3D Scoreboard** with smooth animations
- **Team Rankings** with 3D podium visualization
- **Player Statistics** with leaderboards
- **Match Schedule** with calendar view
- **Photo Uploads** for teams and players
- **Analytics Dashboard** with Recharts visualizations
- **Role-based Access**: Admin, Referee, Viewer

## Technology Stack

**Frontend**: React 18, Wouter, TanStack Query, Three.js, Recharts, Tailwind CSS, Shadcn UI

**Backend**: Node.js, Express, PostgreSQL (Drizzle ORM), Socket.io, Zod

## Getting Started

```bash
npm install
npm run dev
```

Runs on http://localhost:5000

## Database

Uses PostgreSQL with automatic migrations:

```bash
npm run db:push
```

## Project Structure

```
client/src/
  ├── pages/
  │   ├── Dashboard.tsx
  │   ├── LiveMatch.tsx
  │   ├── Rankings.tsx
  │   ├── Schedule.tsx
  │   ├── Players.tsx
  │   ├── Analytics.tsx
  │   ├── AdminDashboard.tsx
  │   └── RefereeDashboard.tsx
  └── components/
      ├── Stadium3D.tsx
      ├── Scoreboard3D.tsx
      ├── Podium3D.tsx
      └── Header.tsx

server/
  ├── routes.ts (API endpoints)
  ├── storage.ts (Drizzle ORM)
  ├── db.ts (Database connection)
  └── seed.ts (Sample data)

shared/
  └── schema.ts (Data models & validation)
```

## Data Models

- **Sports**: Basketball, Football, Cricket
- **Teams**: Name, color, photo, records
- **Players**: Name, number, position, photo, stats
- **Matches**: Status, scores, events
- **Match Events**: Goals, points, fouls

## WebSocket Events

Real-time broadcasting:
- `match:score` - Score updates
- `match:updated` - Status changes
- `match:completed` - Match finished
- `teams:updated` - Team records
- `players:updated` - Player stats

## License

MIT
