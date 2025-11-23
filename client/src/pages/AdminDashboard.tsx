import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Users, Trophy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Team, Player, Match, Sport, InsertTeam, InsertPlayer, InsertMatch, InsertSport } from "@shared/schema";
import { insertTeamSchema, insertPlayerSchema, insertMatchSchema, insertSportSchema } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const { data: sports } = useQuery<Sport[]>({ queryKey: ["/api/sports"] });
  const { data: teams } = useQuery<Team[]>({ queryKey: ["/api/teams"] });
  const { data: players } = useQuery<Player[]>({ queryKey: ["/api/players"] });
  const { data: matches } = useQuery<Match[]>({ queryKey: ["/api/matches"] });

  // Create Sport Mutation
  const createSportMutation = useMutation({
    mutationFn: (data: InsertSport) => apiRequest("POST", "/api/sports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sports"] });
      toast({ title: "Sport created successfully" });
      setOpenDialog(null);
    },
  });

  // Create Team Mutation
  const createTeamMutation = useMutation({
    mutationFn: (data: InsertTeam) => apiRequest("POST", "/api/teams", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Team created successfully" });
      setOpenDialog(null);
    },
  });

  // Create Player Mutation
  const createPlayerMutation = useMutation({
    mutationFn: (data: InsertPlayer) => apiRequest("POST", "/api/players", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Player added successfully" });
      setOpenDialog(null);
    },
  });

  // Create Match Mutation
  const createMatchMutation = useMutation({
    mutationFn: (data: InsertMatch) => apiRequest("POST", "/api/matches", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({ title: "Match scheduled successfully" });
      setOpenDialog(null);
    },
  });

  const handleCreateSport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      maxPlayers: parseInt(formData.get("maxPlayers") as string),
      scoringType: formData.get("scoringType") as string,
    };
    createSportMutation.mutate(data);
  };

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name") as string,
      sportId: formData.get("sportId") as string,
      color: formData.get("color") as string,
    };
    const photoUrl = formData.get("photoUrl") as string;
    if (photoUrl) data.photoUrl = photoUrl;
    createTeamMutation.mutate(data);
  };

  const handleCreatePlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name") as string,
      teamId: formData.get("teamId") as string,
      number: parseInt(formData.get("number") as string),
      position: formData.get("position") as string,
    };
    const photoUrl = formData.get("photoUrl") as string;
    if (photoUrl) data.photoUrl = photoUrl;
    createPlayerMutation.mutate(data);
  };

  const handleCreateMatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      sportId: formData.get("sportId") as string,
      team1Id: formData.get("team1Id") as string,
      team2Id: formData.get("team2Id") as string,
      scheduledTime: new Date(formData.get("scheduledTime") as string),
      venue: formData.get("venue") as string,
      status: "scheduled" as const,
    };
    createMatchMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold font-display mb-2 flex items-center gap-3">
            <Shield className="w-12 h-12 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage sports, teams, players, and matches</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-3xl font-bold font-display mb-1">{teams?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Teams</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold font-display mb-1">{players?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Players</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold font-display mb-1">{matches?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Matches</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold font-display mb-1">{sports?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Sports</div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="sports" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="sports" data-testid="tab-sports">Sports</TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">Teams</TabsTrigger>
            <TabsTrigger value="players" data-testid="tab-players">Players</TabsTrigger>
            <TabsTrigger value="matches" data-testid="tab-matches">Matches</TabsTrigger>
          </TabsList>

          {/* Sports Tab */}
          <TabsContent value="sports">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Sports Management</h2>
                <Dialog open={openDialog === "sport"} onOpenChange={(open) => setOpenDialog(open ? "sport" : null)}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-sport">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sport
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Sport</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSport} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Sport Name</Label>
                        <Input id="name" name="name" required data-testid="input-sport-name" />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" required>
                          <SelectTrigger data-testid="select-sport-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maxPlayers">Max Players</Label>
                        <Input id="maxPlayers" name="maxPlayers" type="number" required data-testid="input-max-players" />
                      </div>
                      <div>
                        <Label htmlFor="scoringType">Scoring Type</Label>
                        <Input id="scoringType" name="scoringType" required placeholder="e.g., points, goals, runs" data-testid="input-scoring-type" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createSportMutation.isPending} data-testid="button-submit-sport">
                        {createSportMutation.isPending ? "Creating..." : "Create Sport"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sports?.map(sport => (
                  <Card key={sport.id} className="p-4" data-testid={`card-sport-${sport.id}`}>
                    <h3 className="font-bold font-display text-lg">{sport.name}</h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">{sport.type}</Badge>
                      <Badge variant="outline">{sport.maxPlayers} players</Badge>
                      <Badge variant="outline">{sport.scoringType}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Teams Management</h2>
                <Dialog open={openDialog === "team"} onOpenChange={(open) => setOpenDialog(open ? "team" : null)}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-team">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Team</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam} className="space-y-4">
                      <div>
                        <Label htmlFor="team-name">Team Name</Label>
                        <Input id="team-name" name="name" required data-testid="input-team-name" />
                      </div>
                      <div>
                        <Label htmlFor="sportId">Sport</Label>
                        <Select name="sportId" required>
                          <SelectTrigger data-testid="select-team-sport">
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {sports?.map(sport => (
                              <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="color">Team Color</Label>
                        <Input id="color" name="color" type="color" defaultValue="#3b82f6" required data-testid="input-team-color" />
                      </div>
                      <div>
                        <Label htmlFor="photoUrl">Team Logo URL (optional)</Label>
                        <Input id="photoUrl" name="photoUrl" placeholder="https://..." data-testid="input-team-photo" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createTeamMutation.isPending} data-testid="button-submit-team">
                        {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams?.map(team => (
                  <Card key={team.id} className="p-4" data-testid={`card-team-${team.id}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold font-display"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold font-display">{team.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {team.wins}W - {team.losses}L
                        </div>
                      </div>
                    </div>
                    <Badge variant="default">{team.points} points</Badge>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Players Management</h2>
                <Dialog open={openDialog === "player"} onOpenChange={(open) => setOpenDialog(open ? "player" : null)}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-player">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Player
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Player</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreatePlayer} className="space-y-4">
                      <div>
                        <Label htmlFor="player-name">Player Name</Label>
                        <Input id="player-name" name="name" required data-testid="input-player-name" />
                      </div>
                      <div>
                        <Label htmlFor="teamId">Team</Label>
                        <Select name="teamId" required>
                          <SelectTrigger data-testid="select-player-team">
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams?.map(team => (
                              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="number">Jersey Number</Label>
                        <Input id="number" name="number" type="number" required data-testid="input-player-number" />
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" name="position" required data-testid="input-player-position" />
                      </div>
                      <div>
                        <Label htmlFor="player-photoUrl">Photo URL (optional)</Label>
                        <Input id="player-photoUrl" name="photoUrl" placeholder="https://..." data-testid="input-player-photo" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createPlayerMutation.isPending} data-testid="button-submit-player">
                        {createPlayerMutation.isPending ? "Adding..." : "Add Player"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                {players?.map(player => {
                  const team = teams?.find(t => t.id === player.teamId);
                  return (
                    <Card key={player.id} className="p-4" data-testid={`card-player-admin-${player.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-display"
                            style={{ backgroundColor: team?.color }}
                          >
                            {player.number}
                          </div>
                          <div>
                            <h3 className="font-bold">{player.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              {team?.name} • {player.position}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Stats</div>
                          <div className="font-bold">{player.totalPoints} pts • {player.totalGoals} goals</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-display">Matches Management</h2>
                <Dialog open={openDialog === "match"} onOpenChange={(open) => setOpenDialog(open ? "match" : null)}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-match">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Match
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Match</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateMatch} className="space-y-4">
                      <div>
                        <Label htmlFor="match-sportId">Sport</Label>
                        <Select name="sportId" required>
                          <SelectTrigger data-testid="select-match-sport">
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {sports?.map(sport => (
                              <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="team1Id">Team 1</Label>
                        <Select name="team1Id" required>
                          <SelectTrigger data-testid="select-team1">
                            <SelectValue placeholder="Select team 1" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams?.map(team => (
                              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="team2Id">Team 2</Label>
                        <Select name="team2Id" required>
                          <SelectTrigger data-testid="select-team2">
                            <SelectValue placeholder="Select team 2" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams?.map(team => (
                              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="scheduledTime">Date & Time</Label>
                        <Input id="scheduledTime" name="scheduledTime" type="datetime-local" required data-testid="input-match-time" />
                      </div>
                      <div>
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" name="venue" required data-testid="input-match-venue" />
                      </div>
                      <Button type="submit" className="w-full" disabled={createMatchMutation.isPending} data-testid="button-submit-match">
                        {createMatchMutation.isPending ? "Scheduling..." : "Schedule Match"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                {matches?.map(match => {
                  const team1 = teams?.find(t => t.id === match.team1Id);
                  const team2 = teams?.find(t => t.id === match.team2Id);
                  return (
                    <Card key={match.id} className="p-4" data-testid={`card-match-admin-${match.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display"
                              style={{ backgroundColor: team1?.color }}
                            >
                              {team1?.name.charAt(0)}
                            </div>
                            <span className="font-semibold">{team1?.name}</span>
                          </div>
                          <span className="text-muted-foreground">vs</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display"
                              style={{ backgroundColor: team2?.color }}
                            >
                              {team2?.name.charAt(0)}
                            </div>
                            <span className="font-semibold">{team2?.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={match.status === "live" ? "destructive" : match.status === "completed" ? "secondary" : "outline"}>
                            {match.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {new Date(match.scheduledTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
