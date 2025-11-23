import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertSportSchema, insertTeamSchema, insertPlayerSchema, insertMatchSchema, insertMatchEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket Server for Real-time Updates
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Helper function to broadcast updates
  const broadcast = (event: string, data: any) => {
    io.emit(event, data);
  };

  // Sports Routes
  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await storage.getAllSports();
      res.json(sports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sports" });
    }
  });

  app.get("/api/sports/:id", async (req, res) => {
    try {
      const sport = await storage.getSport(req.params.id);
      if (!sport) return res.status(404).json({ error: "Sport not found" });
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sport" });
    }
  });

  app.post("/api/sports", async (req, res) => {
    try {
      const data = insertSportSchema.parse(req.body);
      const sport = await storage.createSport(data);
      broadcast("sport:created", sport);
      res.json(sport);
    } catch (error) {
      res.status(400).json({ error: "Invalid sport data" });
    }
  });

  // Teams Routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) return res.status(404).json({ error: "Team not found" });
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const data = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(data);
      broadcast("team:created", team);
      res.json(team);
    } catch (error) {
      res.status(400).json({ error: "Invalid team data" });
    }
  });

  app.patch("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.updateTeam(req.params.id, req.body);
      if (!team) return res.status(404).json({ error: "Team not found" });
      broadcast("team:updated", team);
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team" });
    }
  });

  // Players Routes
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const data = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(data);
      broadcast("player:created", player);
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.updatePlayer(req.params.id, req.body);
      if (!player) return res.status(404).json({ error: "Player not found" });
      broadcast("player:updated", player);
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  // Matches Routes
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) return res.status(404).json({ error: "Match not found" });
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const data = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(data);
      broadcast("match:created", match);
      res.json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      if (!match) return res.status(404).json({ error: "Match not found" });
      broadcast("match:updated", match);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to update match" });
    }
  });

  app.patch("/api/matches/:id/score", async (req, res) => {
    try {
      const { team1Score, team2Score } = req.body;
      const match = await storage.updateMatchScore(req.params.id, team1Score, team2Score);
      if (!match) return res.status(404).json({ error: "Match not found" });
      broadcast("match:score", match);
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to update score" });
    }
  });

  app.patch("/api/matches/:id/end", async (req, res) => {
    try {
      const match = await storage.endMatch(req.params.id);
      if (!match) return res.status(404).json({ error: "Match not found" });
      
      // Broadcast match completion and updated teams
      broadcast("match:completed", match);
      
      const teams = await storage.getAllTeams();
      broadcast("teams:updated", teams);
      
      const players = await storage.getAllPlayers();
      broadcast("players:updated", players);
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to end match" });
    }
  });

  // Match Events Routes
  app.get("/api/matches/:matchId/events", async (req, res) => {
    try {
      const events = await storage.getEventsByMatch(req.params.matchId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/match-events", async (req, res) => {
    try {
      const data = insertMatchEventSchema.parse(req.body);
      const event = await storage.createMatchEvent(data);
      broadcast("event:created", event);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  return httpServer;
}
