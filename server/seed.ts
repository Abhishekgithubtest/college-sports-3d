import { storage } from "./storage";

export async function seedData() {
  console.log("Seeding database...");

  // Create Sports
  const basketball = await storage.createSport({
    name: "Basketball",
    type: "basketball",
    maxPlayers: 5,
    scoringType: "points",
  });

  const football = await storage.createSport({
    name: "Football",
    type: "football",
    maxPlayers: 11,
    scoringType: "goals",
  });

  const cricket = await storage.createSport({
    name: "Cricket",
    type: "cricket",
    maxPlayers: 11,
    scoringType: "runs",
  });

  // Create Basketball Teams
  const tigers = await storage.createTeam({
    name: "Tigers",
    sportId: basketball.id,
    color: "#FF6B35",
  });

  const lions = await storage.createTeam({
    name: "Lions",
    sportId: basketball.id,
    color: "#FFD700",
  });

  const eagles = await storage.createTeam({
    name: "Eagles",
    sportId: basketball.id,
    color: "#3B82F6",
  });

  const wolves = await storage.createTeam({
    name: "Wolves",
    sportId: basketball.id,
    color: "#8B5CF6",
  });

  // Create Football Teams
  const knights = await storage.createTeam({
    name: "Knights",
    sportId: football.id,
    color: "#10B981",
  });

  const warriors = await storage.createTeam({
    name: "Warriors",
    sportId: football.id,
    color: "#EF4444",
  });

  // Create Players for Tigers
  await storage.createPlayer({
    name: "Alex Johnson",
    teamId: tigers.id,
    number: 23,
    position: "Forward",
  });

  await storage.createPlayer({
    name: "Marcus Davis",
    teamId: tigers.id,
    number: 10,
    position: "Guard",
  });

  await storage.createPlayer({
    name: "James Wilson",
    teamId: tigers.id,
    number: 7,
    position: "Center",
  });

  // Create Players for Lions
  await storage.createPlayer({
    name: "Chris Brown",
    teamId: lions.id,
    number: 32,
    position: "Forward",
  });

  await storage.createPlayer({
    name: "Ryan Martinez",
    teamId: lions.id,
    number: 15,
    position: "Guard",
  });

  await storage.createPlayer({
    name: "Kevin Lee",
    teamId: lions.id,
    number: 21,
    position: "Center",
  });

  // Create Players for Eagles
  await storage.createPlayer({
    name: "David Garcia",
    teamId: eagles.id,
    number: 8,
    position: "Forward",
  });

  await storage.createPlayer({
    name: "Tom Anderson",
    teamId: eagles.id,
    number: 5,
    position: "Guard",
  });

  // Create Players for Wolves
  await storage.createPlayer({
    name: "Mike Taylor",
    teamId: wolves.id,
    number: 12,
    position: "Forward",
  });

  await storage.createPlayer({
    name: "Sam Thomas",
    teamId: wolves.id,
    number: 9,
    position: "Guard",
  });

  // Create Players for Knights (Football)
  await storage.createPlayer({
    name: "John Smith",
    teamId: knights.id,
    number: 10,
    position: "Striker",
  });

  await storage.createPlayer({
    name: "Peter Jackson",
    teamId: knights.id,
    number: 7,
    position: "Midfielder",
  });

  // Create Players for Warriors (Football)
  await storage.createPlayer({
    name: "Carlos Rodriguez",
    teamId: warriors.id,
    number: 9,
    position: "Striker",
  });

  await storage.createPlayer({
    name: "Daniel White",
    teamId: warriors.id,
    number: 11,
    position: "Winger",
  });

  // Create Matches
  const match1 = await storage.createMatch({
    sportId: basketball.id,
    team1Id: tigers.id,
    team2Id: lions.id,
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    venue: "Main Arena",
    status: "scheduled",
  });

  const match2 = await storage.createMatch({
    sportId: basketball.id,
    team1Id: eagles.id,
    team2Id: wolves.id,
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    venue: "Sports Complex",
    status: "scheduled",
  });

  const match3 = await storage.createMatch({
    sportId: football.id,
    team1Id: knights.id,
    team2Id: warriors.id,
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    venue: "College Stadium",
    status: "scheduled",
  });

  // Create a completed match with stats
  const completedMatch = await storage.createMatch({
    sportId: basketball.id,
    team1Id: tigers.id,
    team2Id: eagles.id,
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    venue: "Main Arena",
    status: "live",
  });

  // Simulate match with events and scores
  await storage.updateMatchScore(completedMatch.id, 85, 78);
  
  const tigersPlayers = await storage.getPlayersByTeam(tigers.id);
  const eaglesPlayers = await storage.getPlayersByTeam(eagles.id);

  // Add some events
  if (tigersPlayers[0]) {
    await storage.createMatchEvent({
      matchId: completedMatch.id,
      teamId: tigers.id,
      playerId: tigersPlayers[0].id,
      eventType: "point",
    });
  }

  if (eaglesPlayers[0]) {
    await storage.createMatchEvent({
      matchId: completedMatch.id,
      teamId: eagles.id,
      playerId: eaglesPlayers[0].id,
      eventType: "point",
    });
  }

  // End the match
  await storage.endMatch(completedMatch.id);

  console.log("Seed data created successfully!");
}
