# Design Guidelines: College Sports 3D Scoring Platform

## Design Approach
**Reference-Based with 3D Enhancement**: Drawing from modern sports platforms (ESPN, The Score) combined with immersive 3D elements inspired by gaming dashboards and data visualization tools. Foundation follows Material Design principles for data-heavy interfaces, elevated with Three.js 3D interactive elements.

## Core Design Principles
1. **Immersive Data Experience**: 3D elements enhance understanding, not distract from critical information
2. **Real-time Priority**: Live scores and updates are always immediately visible
3. **Depth & Layering**: Use 3D space to organize information hierarchically
4. **Performance Balance**: 3D elements degrade gracefully on lower-end devices

---

## Typography System

**Primary Font**: 'Rajdhani' or 'Russo One' (bold, athletic, modern)
**Secondary Font**: 'Inter' or 'DM Sans' (clean, readable for data)

**Hierarchy**:
- Hero/Stadium Headers: 3xl to 5xl, bold, uppercase tracking-wide
- Section Titles: 2xl to 3xl, semibold
- Live Scores: 4xl to 6xl, bold (dominant)
- Match Info/Stats: base to lg, medium
- Body Text: sm to base, regular
- Captions/Timestamps: xs to sm, light

---

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-1, p-2 (within cards)
- Standard: p-4, p-6, gap-4 (component padding)
- Generous: p-8, p-12, p-16 (section separation)
- XL spacing: p-24 (major section breaks)

**Grid System**:
- Dashboard: 12-column grid with 3D canvas overlay
- Match Cards: 3-4 columns desktop, 2 tablet, 1 mobile
- Stats Display: 2-column split (3D viz left, data right)

**Container Widths**:
- Main Dashboard: max-w-[1600px] (accommodate 3D viewport)
- Data Sections: max-w-7xl
- Forms: max-w-2xl centered

---

## Component Library

### Navigation
**Top Bar**: Fixed header with glass-morphism effect
- Logo with 3D rotating sports equipment icon
- Role-based menu items
- Live match indicator with pulsing animation
- User profile with dropdown

**Side Panel** (for admin/referee):
- Collapsible sidebar with icon navigation
- Active state with subtle 3D depth effect
- Quick actions floating action button (FAB)

### 3D Stadium Viewport
**Hero Section**: Full-width 3D canvas (h-[500px] to h-[600px])
- Interactive camera controls (orbit, zoom)
- Sport-specific environment (court/field/ground)
- Floating scoreboard in 3D space
- Particle effects for celebrations
- Ambient lighting that responds to match state

**Implementation Notes**:
- Canvas container: relative positioning with absolute UI overlays
- Control hints: bottom-right corner (drag to rotate, scroll to zoom)
- Match selector: top-left floating panel with blur backdrop

### Live Score Display
**3D Scoreboard Component**:
- Large score numbers with depth/shadow
- Team names/logos in 3D panels
- Match timer with progress ring
- Score change animations (flip effect, glow pulse)
- Event log sidebar (goals, fouls) with icons

**Compact Score Cards** (for multiple matches):
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Each card: rounded-xl, subtle elevation
- Team logos: circular with 3D rotation on hover
- Live badge: top-right with pulsing dot

### Rankings & Leaderboard
**3D Podium Display**:
- Top 3 teams on animated 3D podiums (gold/silver/bronze)
- Hover to rotate and view team details
- Height corresponds to points/wins

**Table View**:
- Alternating row treatment for readability
- Sortable columns with arrow indicators
- Rank change arrows (up/down) with animation
- Performance sparklines (mini graphs)

### Player Statistics
**3D Player Cards**:
- Portrait mode with 3D rotating player silhouette/avatar
- Stats overlay with radial progress charts
- Flip card interaction: front (photo/model), back (detailed stats)
- Grid display: gap-6, responsive columns

**Stats Dashboard**:
- 3D bar charts using Three.js for performance metrics
- Interactive tooltips on hover
- Comparative view: multiple players side-by-side

### Match Schedule
**3D Calendar Interface**:
- Monthly view with depth layers
- Upcoming matches float above surface
- Click date to zoom into daily schedule
- Match cards with venue, teams, time

**Timeline View** (alternative):
- Horizontal scroll with depth perspective
- Match cards positioned in 3D space
- Current/live matches highlighted with glow

### Forms & Input (Admin/Referee)
**Score Entry Interface**:
- Large touch-friendly buttons (min-h-16)
- Number pad layout for quick entry
- Undo/confirm actions prominently placed
- Real-time preview of scoreboard update

**Team/Player Management**:
- Step-by-step wizard for creating teams
- Image upload with preview
- Autocomplete for player search
- Inline validation with success/error states

### Data Visualization
**Performance Charts**:
- 3D column charts for team comparisons
- Radar charts for player skill assessment
- Heat maps for match activity zones
- Animated transitions between data views

### Notifications & Alerts
**Toast Notifications**:
- Top-right corner positioning
- Glass-morphism background with blur
- Icon + message + action
- Auto-dismiss with progress bar

**Live Update Banner**:
- Top of viewport when new scores available
- Slide-down animation
- Dismiss or click to navigate

---

## Animations & Interactions

**3D Interactions**:
- Smooth camera transitions (1-1.5s ease-in-out)
- Model rotation on mouse move (subtle parallax)
- Zoom on scroll (limited range)
- Celebration particles: fireworks/confetti on goals

**UI Micro-interactions**:
- Button press: subtle scale and shadow change
- Card hover: lift effect (translateY(-4px), shadow increase)
- Score updates: count-up animation
- Rank changes: slide and fade transitions

**Loading States**:
- 3D spinner/rotating logo for scene loading
- Skeleton screens for data fetching
- Progress bars for file uploads

---

## Responsive Strategy

**Desktop (lg+)**: Full 3D experience
- Large viewport for 3D stadium
- Multi-column dashboards
- Side-by-side comparisons

**Tablet (md)**: Simplified 3D
- Reduced particle effects
- Touch-optimized controls
- 2-column layouts

**Mobile (base)**: 2D with 3D accents
- Static 2D scoreboard with subtle depth
- Single column stacking
- Swipe gestures for navigation
- Simplified animations

---

## Images

**Stadium Backgrounds**: Sport-specific venue photos (basketball court, football field, cricket ground) - used as texture maps in 3D scenes or blurred backgrounds for data overlays

**Team Logos**: High-resolution transparent PNGs - displayed in 3D space with rotation capability

**Player Photos**: Headshots or action shots - integrated into 3D player cards with cutout/alpha channel

**Trophy/Achievement Icons**: 3D-rendered trophy models or 2D icons with depth treatment

**Sport Equipment**: 3D models of balls, bats, goals - floating elements throughout UI

**Hero Section**: NO large hero image - instead, the 3D interactive stadium viewport serves as the visual anchor