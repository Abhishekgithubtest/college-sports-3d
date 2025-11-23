import { useQuery } from "@tanstack/react-query";
import { Podium3D } from "@/components/Podium3D";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import type { Team } from "@shared/schema";

export default function Rankings() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const sortedTeams = [...(teams || [])].sort((a, b) => {
    // Sort by points, then by wins
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  const topThree = sortedTeams.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <Trophy className="w-12 h-12 text-primary" />
            Team Rankings
          </h1>
          <p className="text-muted-foreground text-lg">Live standings and team performance</p>
        </div>

        {/* 3D Podium */}
        {topThree.length >= 3 && (
          <div className="mb-12">
            <Podium3D topTeams={topThree} />
          </div>
        )}

        {/* Full Rankings Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-bold font-display">Rank</th>
                  <th className="text-left p-4 font-bold font-display">Team</th>
                  <th className="text-center p-4 font-bold font-display">Wins</th>
                  <th className="text-center p-4 font-bold font-display">Losses</th>
                  <th className="text-center p-4 font-bold font-display">Points</th>
                  <th className="text-center p-4 font-bold font-display">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => {
                  const totalGames = team.wins + team.losses;
                  const winRate = totalGames > 0 
                    ? ((team.wins / totalGames) * 100).toFixed(1) 
                    : "0.0";

                  return (
                    <tr 
                      key={team.id} 
                      className="border-b hover-elevate transition-colors"
                      data-testid={`row-team-${team.id}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold font-display tabular-nums w-8">
                            {index + 1}
                          </span>
                          {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {index === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-display flex-shrink-0"
                            style={{ backgroundColor: team.color }}
                          >
                            {team.name.charAt(0)}
                          </div>
                          <span className="font-semibold" data-testid={`text-team-name-${team.id}`}>
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-lg font-bold font-display text-chart-2" data-testid={`text-wins-${team.id}`}>
                          {team.wins}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-lg font-bold font-display text-destructive" data-testid={`text-losses-${team.id}`}>
                          {team.losses}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="default" className="text-lg px-3 py-1" data-testid={`text-points-${team.id}`}>
                          {team.points}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-lg font-bold font-display">
                            {winRate}%
                          </span>
                          {parseFloat(winRate) >= 50 ? (
                            <TrendingUp className="w-4 h-4 text-chart-2" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="p-12 text-center text-muted-foreground">
              Loading rankings...
            </div>
          )}

          {!isLoading && sortedTeams.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No teams yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
