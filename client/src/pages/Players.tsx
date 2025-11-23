import { useQuery } from "@tanstack/react-query";
import { PlayerCard3D } from "@/components/PlayerCard3D";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award } from "lucide-react";
import type { Player, Team } from "@shared/schema";

export default function Players() {
  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const getTeam = (id: string) => teams?.find(t => t.id === id);

  const topScorers = [...(players || [])]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <Users className="w-12 h-12 text-primary" />
            Player Statistics
          </h1>
          <p className="text-muted-foreground text-lg">Performance metrics and achievements</p>
        </div>

        {/* Top Scorers */}
        {topScorers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-bold font-display">Top Scorers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {topScorers.map((player, index) => {
                const team = getTeam(player.teamId);
                if (!team) return null;
                return (
                  <Card key={player.id} className="p-4 text-center hover-elevate">
                    <div className="text-4xl font-bold font-display text-primary mb-2">
                      #{index + 1}
                    </div>
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 font-bold font-display text-2xl"
                      style={{ backgroundColor: team.color }}
                    >
                      {player.number}
                    </div>
                    <div className="font-bold mb-1">{player.name}</div>
                    <Badge variant="secondary" className="mb-2">{team.name}</Badge>
                    <div className="text-2xl font-bold font-display text-accent">
                      {player.totalPoints} pts
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Players */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold font-display">All Players</h2>
          <p className="text-muted-foreground">Click cards to view detailed statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players?.map(player => {
            const team = getTeam(player.teamId);
            if (!team) return null;
            return <PlayerCard3D key={player.id} player={player} team={team} />;
          })}
        </div>

        {isLoading && (
          <div className="py-12 text-center text-muted-foreground">
            Loading players...
          </div>
        )}

        {!isLoading && (!players || players.length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            No players yet
          </div>
        )}
      </div>
    </div>
  );
}
