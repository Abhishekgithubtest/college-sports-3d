import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import type { Team, Match } from "@shared/schema";

interface Scoreboard3DProps {
  match: Match;
  team1: Team;
  team2: Team;
  className?: string;
}

export function Scoreboard3D({ match, team1, team2, className = "" }: Scoreboard3DProps) {
  const score1Ref = useRef<HTMLDivElement>(null);
  const score2Ref = useRef<HTMLDivElement>(null);
  const prevScore1 = useRef(match.team1Score);
  const prevScore2 = useRef(match.team2Score);

  useEffect(() => {
    // Animate score changes
    if (match.team1Score !== prevScore1.current && score1Ref.current) {
      score1Ref.current.classList.add("animate-bounce");
      setTimeout(() => score1Ref.current?.classList.remove("animate-bounce"), 1000);
      prevScore1.current = match.team1Score;
    }

    if (match.team2Score !== prevScore2.current && score2Ref.current) {
      score2Ref.current.classList.add("animate-bounce");
      setTimeout(() => score2Ref.current?.classList.remove("animate-bounce"), 1000);
      prevScore2.current = match.team2Score;
    }
  }, [match.team1Score, match.team2Score]);

  const isLive = match.status === "live";
  const winner = match.winnerId === team1.id ? team1 : match.winnerId === team2.id ? team2 : null;

  return (
    <Card className={`relative overflow-hidden border-2 ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
            LIVE
          </Badge>
        </div>
      )}

      <div className="relative p-8">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold font-display"
              style={{ backgroundColor: team1.color }}
            >
              {team1.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold font-display text-center">{team1.name}</h3>
            <div 
              ref={score1Ref}
              className="text-7xl font-bold font-display tabular-nums"
              data-testid={`score-team1-${match.id}`}
            >
              {match.team1Score}
            </div>
            {winner?.id === team1.id && (
              <Badge variant="default" className="gap-1">
                <Trophy className="w-4 h-4" />
                Winner
              </Badge>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold font-display text-muted-foreground">VS</div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold font-display"
              style={{ backgroundColor: team2.color }}
            >
              {team2.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-bold font-display text-center">{team2.name}</h3>
            <div 
              ref={score2Ref}
              className="text-7xl font-bold font-display tabular-nums"
              data-testid={`score-team2-${match.id}`}
            >
              {match.team2Score}
            </div>
            {winner?.id === team2.id && (
              <Badge variant="default" className="gap-1">
                <Trophy className="w-4 h-4" />
                Winner
              </Badge>
            )}
          </div>
        </div>

        {/* Match info */}
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold">{match.venue}</div>
            <div>{new Date(match.scheduledTime).toLocaleString()}</div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {match.status.toUpperCase()}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
