import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, BarChart3, TrendingUp } from "lucide-react";
import type { Team, Player, Match } from "@shared/schema";

export default function Analytics() {
  const { data: teams } = useQuery<Team[]>({ queryKey: ["/api/teams"] });
  const { data: players } = useQuery<Player[]>({ queryKey: ["/api/players"] });
  const { data: matches } = useQuery<Match[]>({ queryKey: ["/api/matches"] });

  // Team records chart data
  const teamChartData = (teams || []).map(team => ({
    name: team.name,
    wins: team.wins,
    losses: team.losses,
    points: team.points,
  }));

  // Top scorers
  const topScorers = (players || [])
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10)
    .map(p => {
      const team = teams?.find(t => t.id === p.teamId);
      return {
        name: p.name,
        points: p.totalPoints,
        goals: p.totalGoals,
        games: p.gamesPlayed,
        team: team?.name || "Unknown",
      };
    });

  // Match status breakdown
  const matchStatusBreakdown = [
    { name: "Completed", value: matches?.filter(m => m.status === "completed").length || 0, color: "#10b981" },
    { name: "Live", value: matches?.filter(m => m.status === "live").length || 0, color: "#ef4444" },
    { name: "Scheduled", value: matches?.filter(m => m.status === "scheduled").length || 0, color: "#3b82f6" },
  ];

  // Statistics
  const totalMatches = matches?.length || 0;
  const completedMatches = matches?.filter(m => m.status === "completed").length || 0;
  const avgPointsPerTeam = teams && teams.length > 0
    ? Math.round(teams.reduce((sum, t) => sum + t.points, 0) / teams.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <BarChart3 className="w-12 h-12 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Real-time sports statistics and insights</p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Teams</p>
                <p className="text-4xl font-bold font-display">{teams?.length || 0}</p>
              </div>
              <Trophy className="w-10 h-10 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Players</p>
                <p className="text-4xl font-bold font-display">{players?.length || 0}</p>
              </div>
              <Users className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Matches</p>
                <p className="text-4xl font-bold font-display">{totalMatches}</p>
              </div>
              <Activity className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Completed</p>
                <p className="text-4xl font-bold font-display">{completedMatches}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team Records Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold font-display mb-4">Team Records</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#10b981" name="Wins" />
                <Bar dataKey="losses" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Team Points Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold font-display mb-4">Team Points</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="points" stroke="#0091FF" strokeWidth={2} name="Points" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Match Status Breakdown */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold font-display mb-4">Match Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={matchStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchStatusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Scorers */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold font-display mb-4">Top Scorers</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {topScorers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.team}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">{player.points} pts</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{player.games} games</p>
                  </div>
                </div>
              ))}
              {topScorers.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No player data available</p>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Matches */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold font-display mb-4">Recent Matches</h2>
          <div className="space-y-3">
            {matches?.slice(0, 10).map(match => {
              const team1 = teams?.find(t => t.id === match.team1Id);
              const team2 = teams?.find(t => t.id === match.team2Id);
              return (
                <div key={match.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{team1?.name || "Team 1"} vs {team2?.name || "Team 2"}</p>
                    <p className="text-sm text-muted-foreground">{match.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{match.team1Score} - {match.team2Score}</p>
                    <Badge variant={match.status === "live" ? "default" : match.status === "completed" ? "secondary" : "outline"}>
                      {match.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Trophy, Users } from "lucide-react";
