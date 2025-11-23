import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import type { Team, Match } from "@shared/schema";
import { Link } from "wouter";

interface LiveMatchCardProps {
  match: Match;
  team1: Team;
  team2: Team;
}

export function LiveMatchCard({ match, team1, team2 }: LiveMatchCardProps) {
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";

  return (
    <Link href={`/match/${match.id}`}>
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300" data-testid={`card-match-${match.id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
            {isLive ? (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
                LIVE
              </Badge>
            ) : isCompleted ? (
              <Badge variant="secondary">FINAL</Badge>
            ) : (
              <Badge variant="outline">SCHEDULED</Badge>
            )}
          </div>

          {/* Teams and Scores */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Team 1 */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold font-display text-xl flex-shrink-0"
                style={{ backgroundColor: team1.color }}
              >
                {team1.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate" data-testid={`text-team1-${match.id}`}>{team1.name}</div>
                {isCompleted && (
                  <div className="text-xs text-muted-foreground">
                    {team1.wins}W - {team1.losses}L
                  </div>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="text-center px-4">
              {isLive || isCompleted ? (
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold font-display tabular-nums" data-testid={`score-team1-card-${match.id}`}>
                    {match.team1Score}
                  </div>
                  <div className="text-2xl text-muted-foreground">-</div>
                  <div className="text-3xl font-bold font-display tabular-nums" data-testid={`score-team2-card-${match.id}`}>
                    {match.team2Score}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground font-bold">VS</div>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold font-display text-xl flex-shrink-0"
                style={{ backgroundColor: team2.color }}
              >
                {team2.name.charAt(0)}
              </div>
              <div className="min-w-0 text-right">
                <div className="font-semibold truncate" data-testid={`text-team2-${match.id}`}>{team2.name}</div>
                {isCompleted && (
                  <div className="text-xs text-muted-foreground">
                    {team2.wins}W - {team2.losses}L
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{new Date(match.scheduledTime).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
