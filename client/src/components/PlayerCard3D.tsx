import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Activity } from "lucide-react";
import type { Player, Team } from "@shared/schema";

interface PlayerCard3DProps {
  player: Player;
  team: Team;
}

export function PlayerCard3D({ player, team }: PlayerCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const avgPoints = player.gamesPlayed > 0 
    ? (player.totalPoints / player.gamesPlayed).toFixed(1) 
    : "0.0";

  return (
    <div 
      className="perspective-1000 h-[300px]"
      onClick={() => setIsFlipped(!isFlipped)}
      data-testid={`card-player-${player.id}`}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden hover-elevate" style={{ backfaceVisibility: 'hidden' }}>
          <div className="h-full flex flex-col items-center justify-center p-6 gap-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: team.color }}
            >
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold font-display mb-2">#{player.number}</div>
              <h3 className="text-xl font-bold font-display">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.position || 'Player'}</p>
            </div>
            <Badge variant="secondary" className="mt-auto">
              {team.name}
            </Badge>
            <div className="text-xs text-muted-foreground">Click to flip</div>
          </div>
        </Card>

        {/* Back */}
        <Card 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary/20 via-card to-accent/20" 
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold font-display text-lg">Statistics</h4>
              <Badge variant="outline">{player.name}</Badge>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between p-3 rounded-md bg-background/50">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Total Points</span>
                </div>
                <span className="text-2xl font-bold font-display" data-testid={`stat-points-${player.id}`}>
                  {player.totalPoints}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-background/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Total Goals</span>
                </div>
                <span className="text-2xl font-bold font-display" data-testid={`stat-goals-${player.id}`}>
                  {player.totalGoals}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-background/50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-chart-2" />
                  <span className="text-sm font-medium">Games Played</span>
                </div>
                <span className="text-2xl font-bold font-display" data-testid={`stat-games-${player.id}`}>
                  {player.gamesPlayed}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-background/50 border-2 border-primary/20">
                <span className="text-sm font-medium">Avg Points/Game</span>
                <span className="text-2xl font-bold font-display text-primary">
                  {avgPoints}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center mt-4">Click to flip back</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
