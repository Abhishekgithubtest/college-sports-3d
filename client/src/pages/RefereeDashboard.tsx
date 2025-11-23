import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, Trophy, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Match, Team, Player, InsertMatchEvent } from "@shared/schema";

export default function RefereeDashboard() {
  const { toast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const { data: matches } = useQuery<Match[]>({ queryKey: ["/api/matches"] });
  const { data: teams } = useQuery<Team[]>({ queryKey: ["/api/teams"] });
  const { data: players } = useQuery<Player[]>({ queryKey: ["/api/players"] });

  const liveMatches = matches?.filter(m => m.status === "live") || [];
  const scheduledMatches = matches?.filter(m => m.status === "scheduled") || [];

  const selectedMatchData = matches?.find(m => m.id === selectedMatch);
  const team1 = selectedMatchData ? teams?.find(t => t.id === selectedMatchData.team1Id) : null;
  const team2 = selectedMatchData ? teams?.find(t => t.id === selectedMatchData.team2Id) : null;
  const team1Players = team1 ? players?.filter(p => p.teamId === team1.id) : [];
  const team2Players = team2 ? players?.filter(p => p.teamId === team2.id) : [];

  // Start Match Mutation
  const startMatchMutation = useMutation({
    mutationFn: (matchId: string) => apiRequest("PATCH", `/api/matches/${matchId}`, { status: "live" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Match started!" });
    },
  });

  // Update Score Mutation
  const updateScoreMutation = useMutation({
    mutationFn: ({ matchId, team1Score, team2Score }: { matchId: string; team1Score: number; team2Score: number }) =>
      apiRequest("PATCH", `/api/matches/${matchId}/score`, { team1Score, team2Score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Score updated!" });
    },
  });

  // Add Event Mutation
  const addEventMutation = useMutation({
    mutationFn: (data: InsertMatchEvent) => apiRequest("POST", "/api/match-events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Event recorded!" });
    },
  });

  // End Match Mutation
  const endMatchMutation = useMutation({
    mutationFn: (matchId: string) => apiRequest("PATCH", `/api/matches/${matchId}/end`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Match completed!" });
      setSelectedMatch("");
    },
  });

  const handleScoreUpdate = (team: 1 | 2, increment: number) => {
    if (!selectedMatchData) return;
    
    const newScore1 = team === 1 ? score1 + increment : score1;
    const newScore2 = team === 2 ? score2 + increment : score2;
    
    setScore1(Math.max(0, newScore1));
    setScore2(Math.max(0, newScore2));
    
    updateScoreMutation.mutate({
      matchId: selectedMatch,
      team1Score: Math.max(0, newScore1),
      team2Score: Math.max(0, newScore2),
    });
  };

  const handleAddEvent = (teamId: string, playerId: string | null, eventType: string) => {
    if (!selectedMatch) return;
    
    addEventMutation.mutate({
      matchId: selectedMatch,
      teamId,
      playerId,
      eventType,
      description: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <Zap className="w-12 h-12 text-primary" />
            Referee Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Update live scores and manage match events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Match Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold font-display mb-4">Select Match</h2>
              
              {/* Live Matches */}
              {liveMatches.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                  </div>
                  <div className="space-y-2">
                    {liveMatches.map(match => {
                      const t1 = teams?.find(t => t.id === match.team1Id);
                      const t2 = teams?.find(t => t.id === match.team2Id);
                      return (
                        <Button
                          key={match.id}
                          variant={selectedMatch === match.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => {
                            setSelectedMatch(match.id);
                            setScore1(match.team1Score);
                            setScore2(match.team2Score);
                          }}
                          data-testid={`button-select-match-${match.id}`}
                        >
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{t1?.name}</span>
                              <span className="font-bold">{match.team1Score}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{t2?.name}</span>
                              <span className="font-bold">{match.team2Score}</span>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scheduled Matches */}
              {scheduledMatches.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-2">Scheduled</div>
                  <div className="space-y-2">
                    {scheduledMatches.slice(0, 5).map(match => {
                      const t1 = teams?.find(t => t.id === match.team1Id);
                      const t2 = teams?.find(t => t.id === match.team2Id);
                      return (
                        <Card key={match.id} className="p-3">
                          <div className="text-sm mb-2">
                            <div className="font-semibold">{t1?.name} vs {t2?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(match.scheduledTime).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => startMatchMutation.mutate(match.id)}
                            disabled={startMatchMutation.isPending}
                            data-testid={`button-start-match-${match.id}`}
                          >
                            Start Match
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {liveMatches.length === 0 && scheduledMatches.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No matches available
                </div>
              )}
            </Card>
          </div>

          {/* Score Control */}
          <div className="lg:col-span-2">
            {selectedMatchData && team1 && team2 ? (
              <div className="space-y-6">
                {/* Scoreboard */}
                <Card className="p-8">
                  <div className="grid grid-cols-3 gap-8 items-center mb-6">
                    {/* Team 1 */}
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold font-display"
                        style={{ backgroundColor: team1.color }}
                      >
                        {team1.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold font-display mb-4">{team1.name}</h3>
                      <div className="text-6xl font-bold font-display mb-4" data-testid="score-display-team1">
                        {score1}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="lg"
                          onClick={() => handleScoreUpdate(1, 1)}
                          disabled={updateScoreMutation.isPending}
                          data-testid="button-score-team1-plus"
                        >
                          +1
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => handleScoreUpdate(1, -1)}
                          disabled={updateScoreMutation.isPending}
                          variant="outline"
                          data-testid="button-score-team1-minus"
                        >
                          -1
                        </Button>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-4xl font-bold font-display text-muted-foreground">VS</div>
                    </div>

                    {/* Team 2 */}
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold font-display"
                        style={{ backgroundColor: team2.color }}
                      >
                        {team2.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold font-display mb-4">{team2.name}</h3>
                      <div className="text-6xl font-bold font-display mb-4" data-testid="score-display-team2">
                        {score2}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="lg"
                          onClick={() => handleScoreUpdate(2, 1)}
                          disabled={updateScoreMutation.isPending}
                          data-testid="button-score-team2-plus"
                        >
                          +1
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => handleScoreUpdate(2, -1)}
                          disabled={updateScoreMutation.isPending}
                          variant="outline"
                          data-testid="button-score-team2-minus"
                        >
                          -1
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-6 border-t">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => endMatchMutation.mutate(selectedMatch)}
                      disabled={endMatchMutation.isPending}
                      data-testid="button-end-match"
                    >
                      End Match
                    </Button>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold font-display mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team 1 Actions */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: team1.color }}
                        />
                        {team1.name}
                      </h4>
                      <div className="space-y-2">
                        <Select onValueChange={(playerId) => handleAddEvent(team1.id, playerId, "goal")}>
                          <SelectTrigger data-testid="select-goal-team1">
                            <SelectValue placeholder="Record Goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {team1Players?.map(player => (
                              <SelectItem key={player.id} value={player.id}>
                                #{player.number} {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select onValueChange={(playerId) => handleAddEvent(team1.id, playerId, "point")}>
                          <SelectTrigger data-testid="select-point-team1">
                            <SelectValue placeholder="Record Point" />
                          </SelectTrigger>
                          <SelectContent>
                            {team1Players?.map(player => (
                              <SelectItem key={player.id} value={player.id}>
                                #{player.number} {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Team 2 Actions */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: team2.color }}
                        />
                        {team2.name}
                      </h4>
                      <div className="space-y-2">
                        <Select onValueChange={(playerId) => handleAddEvent(team2.id, playerId, "goal")}>
                          <SelectTrigger data-testid="select-goal-team2">
                            <SelectValue placeholder="Record Goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {team2Players?.map(player => (
                              <SelectItem key={player.id} value={player.id}>
                                #{player.number} {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select onValueChange={(playerId) => handleAddEvent(team2.id, playerId, "point")}>
                          <SelectTrigger data-testid="select-point-team2">
                            <SelectValue placeholder="Record Point" />
                          </SelectTrigger>
                          <SelectContent>
                            {team2Players?.map(player => (
                              <SelectItem key={player.id} value={player.id}>
                                #{player.number} {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold font-display mb-2">No Match Selected</h3>
                <p className="text-muted-foreground">Select a match from the left to start scoring</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
