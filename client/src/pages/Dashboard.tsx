import { useQuery } from "@tanstack/react-query";
import { Stadium3D } from "@/components/Stadium3D";
import { LiveMatchCard } from "@/components/LiveMatchCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Activity } from "lucide-react";
import type { Match, Team, Sport } from "@shared/schema";

export default function Dashboard() {
  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: sports } = useQuery<Sport[]>({
    queryKey: ["/api/sports"],
  });

  const liveMatches = matches?.filter(m => m.status === "live") || [];
  const upcomingMatches = matches?.filter(m => m.status === "scheduled").slice(0, 3) || [];
  const completedMatches = matches?.filter(m => m.status === "completed").slice(0, 3) || [];

  const getTeam = (id: string) => teams?.find(t => t.id === id);
  const currentSport = sports?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero 3D Stadium Section */}
      <section className="relative h-[600px] overflow-hidden">
        <Stadium3D 
          sportType={currentSport?.type as any || "basketball"} 
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Floating Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl md:text-8xl font-bold font-display mb-4 tracking-wide uppercase">
              College Sports
            </h1>
            <p className="text-xl md:text-2xl font-medium">Live Scoring & Rankings Platform</p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 hover-elevate">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display" data-testid="stat-live-matches">
                  {liveMatches.length}
                </div>
                <div className="text-sm text-muted-foreground">Live Matches</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-chart-2" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display" data-testid="stat-total-teams">
                  {teams?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Teams</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display" data-testid="stat-upcoming-matches">
                  {upcomingMatches.length}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display" data-testid="stat-total-sports">
                  {sports?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Sports</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold font-display">Live Matches</h2>
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
              {liveMatches.length} LIVE
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map(match => {
              const team1 = getTeam(match.team1Id);
              const team2 = getTeam(match.team2Id);
              if (!team1 || !team2) return null;
              return (
                <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-bold font-display mb-6">Upcoming Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map(match => {
              const team1 = getTeam(match.team1Id);
              const team2 = getTeam(match.team2Id);
              if (!team1 || !team2) return null;
              return (
                <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Results */}
      {completedMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <h2 className="text-3xl font-bold font-display mb-6">Recent Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedMatches.map(match => {
              const team1 = getTeam(match.team1Id);
              const team2 = getTeam(match.team2Id);
              if (!team1 || !team2) return null;
              return (
                <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />
              );
            })}
          </div>
        </section>
      )}

      {matchesLoading && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="text-muted-foreground">Loading matches...</div>
        </div>
      )}
    </div>
  );
}
