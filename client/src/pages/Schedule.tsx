import { useQuery } from "@tanstack/react-query";
import { LiveMatchCard } from "@/components/LiveMatchCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import type { Match, Team } from "@shared/schema";

export default function Schedule() {
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const getTeam = (id: string) => teams?.find(t => t.id === id);

  const scheduledMatches = matches?.filter(m => m.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()) || [];
  
  const liveMatches = matches?.filter(m => m.status === "live") || [];
  
  const completedMatches = matches?.filter(m => m.status === "completed")
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()) || [];

  const groupByDate = (matches: Match[]) => {
    const groups: Record<string, Match[]> = {};
    matches.forEach(match => {
      const date = new Date(match.scheduledTime).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(match);
    });
    return groups;
  };

  const scheduledByDate = groupByDate(scheduledMatches);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <Calendar className="w-12 h-12 text-primary" />
            Match Schedule
          </h1>
          <p className="text-muted-foreground text-lg">View all matches - past, present, and future</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upcoming" className="gap-2" data-testid="tab-upcoming">
              <Clock className="w-4 h-4" />
              Upcoming
              <Badge variant="secondary" className="ml-1">{scheduledMatches.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2" data-testid="tab-live">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
              Live
              <Badge variant="secondary" className="ml-1">{liveMatches.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2" data-testid="tab-completed">
              <CheckCircle className="w-4 h-4" />
              Completed
              <Badge variant="secondary" className="ml-1">{completedMatches.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Upcoming */}
          <TabsContent value="upcoming" className="space-y-8">
            {Object.entries(scheduledByDate).map(([date, dayMatches]) => (
              <div key={date}>
                <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {date}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayMatches.map(match => {
                    const team1 = getTeam(match.team1Id);
                    const team2 = getTeam(match.team2Id);
                    if (!team1 || !team2) return null;
                    return <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />;
                  })}
                </div>
              </div>
            ))}
            {scheduledMatches.length === 0 && (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming matches scheduled</p>
              </Card>
            )}
          </TabsContent>

          {/* Live */}
          <TabsContent value="live">
            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMatches.map(match => {
                  const team1 = getTeam(match.team1Id);
                  const team2 = getTeam(match.team2Id);
                  if (!team1 || !team2) return null;
                  return <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />;
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <span className="relative flex h-12 w-12 mx-auto mb-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-12 w-12 bg-muted"></span>
                </span>
                <p className="text-muted-foreground">No live matches at the moment</p>
              </Card>
            )}
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed">
            {completedMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMatches.map(match => {
                  const team1 = getTeam(match.team1Id);
                  const team2 = getTeam(match.team2Id);
                  if (!team1 || !team2) return null;
                  return <LiveMatchCard key={match.id} match={match} team1={team1} team2={team2} />;
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed matches yet</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="py-12 text-center text-muted-foreground">
            Loading schedule...
          </div>
        )}
      </div>
    </div>
  );
}
