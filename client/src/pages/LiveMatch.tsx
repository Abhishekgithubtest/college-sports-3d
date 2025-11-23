import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Scoreboard3D } from "@/components/Scoreboard3D";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Clock } from "lucide-react";
import { Link } from "wouter";
import type { Match, Team, MatchEvent, Player } from "@shared/schema";

export default function LiveMatch() {
  const [, params] = useRoute("/match/:id");
  const matchId = params?.id;

  const { data: match } = useQuery<Match>({
    queryKey: ["/api/matches", matchId],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: events } = useQuery<MatchEvent[]>({
    queryKey: ["/api/matches", matchId, "events"],
    enabled: !!matchId,
  });

  const { data: players } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  if (!match || !teams) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading match...</div>
      </div>
    );
  }

  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);

  if (!team1 || !team2) return null;

  const getPlayer = (id: string) => players?.find(p => p.id === id);
  const sortedEvents = [...(events || [])].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* 3D Scoreboard */}
        <div className="mb-8">
          <Scoreboard3D match={match} team1={team1} team2={team2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Match Events */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Match Events
              </h2>

              <div className="space-y-3">
                {sortedEvents && sortedEvents.length > 0 ? (
                  sortedEvents.map(event => {
                    const player = getPlayer(event.playerId || "");
                    const team = teams.find(t => t.id === event.teamId);
                    
                    return (
                      <div 
                        key={event.id} 
                        className="flex items-center gap-4 p-4 rounded-lg bg-accent/10 hover-elevate"
                        data-testid={`event-${event.id}`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: team?.color }}
                        >
                          {event.eventType === "goal" ? <Target className="w-5 h-5" /> : 
                           event.eventType === "point" ? <Trophy className="w-5 h-5" /> : "!"}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">
                            {event.eventType.toUpperCase()} - {team?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player ? `${player.name} (#${player.number})` : "Team"} 
                            {event.description && ` - ${event.description}`}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No events yet
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Team Stats */}
          <div className="space-y-6">
            {/* Team 1 */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-display"
                  style={{ backgroundColor: team1.color }}
                >
                  {team1.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg">{team1.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {team1.wins}W - {team1.losses}L
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Points</span>
                  <span className="font-bold">{team1.points}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ranking</span>
                  <span className="font-bold">
                    #{teams.sort((a, b) => b.points - a.points).findIndex(t => t.id === team1.id) + 1}
                  </span>
                </div>
              </div>
            </Card>

            {/* Team 2 */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-display"
                  style={{ backgroundColor: team2.color }}
                >
                  {team2.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg">{team2.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {team2.wins}W - {team2.losses}L
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Points</span>
                  <span className="font-bold">{team2.points}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ranking</span>
                  <span className="font-bold">
                    #{teams.sort((a, b) => b.points - a.points).findIndex(t => t.id === team2.id) + 1}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
