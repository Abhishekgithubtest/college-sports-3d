import type {
  User, InsertUser,
  Sport, InsertSport,
  Team, InsertTeam,
  Player, InsertPlayer,
  Match, InsertMatch,
  MatchEvent, InsertMatchEvent
} from "@shared/schema";
import {
  users, sports, teams, players, matches, matchEvents
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Sports
  getAllSports(): Promise<Sport[]>;
  getSport(id: string): Promise<Sport | undefined>;
  createSport(sport: InsertSport): Promise<Sport>;

  // Teams
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  getTeamsBySport(sportId: string): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined>;

  // Players
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined>;

  // Matches
  getAllMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesBySport(sportId: string): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined>;
  updateMatchScore(id: string, team1Score: number, team2Score: number): Promise<Match | undefined>;
  endMatch(id: string): Promise<Match | undefined>;

  // Match Events
  getAllMatchEvents(): Promise<MatchEvent[]>;
  getMatchEvent(id: string): Promise<MatchEvent | undefined>;
  getEventsByMatch(matchId: string): Promise<MatchEvent[]>;
  createMatchEvent(event: InsertMatchEvent): Promise<MatchEvent>;
}

export class DrizzleStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0]!;
  }

  // Sports
  async getAllSports(): Promise<Sport[]> {
    return db.select().from(sports);
  }

  async getSport(id: string): Promise<Sport | undefined> {
    const result = await db.select().from(sports).where(eq(sports.id, id));
    return result[0];
  }

  async createSport(insertSport: InsertSport): Promise<Sport> {
    const result = await db.insert(sports).values(insertSport).returning();
    return result[0]!;
  }

  // Teams
  async getAllTeams(): Promise<Team[]> {
    return db.select().from(teams);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const result = await db.select().from(teams).where(eq(teams.id, id));
    return result[0];
  }

  async getTeamsBySport(sportId: string): Promise<Team[]> {
    return db.select().from(teams).where(eq(teams.sportId, sportId));
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const result = await db.insert(teams).values(insertTeam).returning();
    return result[0]!;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const result = await db.update(teams).set(updates).where(eq(teams.id, id)).returning();
    return result[0];
  }

  // Players
  async getAllPlayers(): Promise<Player[]> {
    return db.select().from(players);
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return db.select().from(players).where(eq(players.teamId, teamId));
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(insertPlayer).returning();
    return result[0]!;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined> {
    const result = await db.update(players).set(updates).where(eq(players.id, id)).returning();
    return result[0];
  }

  // Matches
  async getAllMatches(): Promise<Match[]> {
    return db.select().from(matches);
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(eq(matches.id, id));
    return result[0];
  }

  async getMatchesBySport(sportId: string): Promise<Match[]> {
    return db.select().from(matches).where(eq(matches.sportId, sportId));
  }

  async getLiveMatches(): Promise<Match[]> {
    return db.select().from(matches).where(eq(matches.status, "live"));
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const result = await db.insert(matches).values(insertMatch).returning();
    return result[0]!;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined> {
    const result = await db.update(matches).set(updates).where(eq(matches.id, id)).returning();
    return result[0];
  }

  async updateMatchScore(id: string, team1Score: number, team2Score: number): Promise<Match | undefined> {
    const result = await db.update(matches)
      .set({ team1Score, team2Score })
      .where(eq(matches.id, id))
      .returning();
    return result[0];
  }

  async endMatch(id: string): Promise<Match | undefined> {
    const match = await this.getMatch(id);
    if (!match) return undefined;

    // Determine winner
    const winnerId = match.team1Score > match.team2Score 
      ? match.team1Id 
      : match.team2Score > match.team1Score 
        ? match.team2Id 
        : null;

    // Update match status
    await db.update(matches)
      .set({ status: "completed", winnerId })
      .where(eq(matches.id, id));

    // Update team records
    const team1 = await this.getTeam(match.team1Id);
    const team2 = await this.getTeam(match.team2Id);

    if (team1 && team2) {
      if (winnerId === match.team1Id) {
        await this.updateTeam(team1.id, { wins: team1.wins + 1, points: team1.points + 3 });
        await this.updateTeam(team2.id, { losses: team2.losses + 1 });
      } else if (winnerId === match.team2Id) {
        await this.updateTeam(team2.id, { wins: team2.wins + 1, points: team2.points + 3 });
        await this.updateTeam(team1.id, { losses: team1.losses + 1 });
      } else {
        // Draw - give 1 point each
        await this.updateTeam(team1.id, { points: team1.points + 1 });
        await this.updateTeam(team2.id, { points: team2.points + 1 });
      }
    }

    // Update player stats
    const events = await this.getEventsByMatch(id);
    const playerStats = new Map<string, { goals: number; points: number }>();

    events.forEach(event => {
      if (!event.playerId) return;
      const current = playerStats.get(event.playerId) || { goals: 0, points: 0 };
      if (event.eventType === "goal") current.goals += 1;
      if (event.eventType === "point") current.points += 1;
      playerStats.set(event.playerId, current);
    });

    for (const [playerId, stats] of playerStats) {
      const player = await this.getPlayer(playerId);
      if (player) {
        await this.updatePlayer(playerId, {
          totalGoals: player.totalGoals + stats.goals,
          totalPoints: player.totalPoints + stats.points,
          gamesPlayed: player.gamesPlayed + 1,
        });
      }
    }

    const updatedMatch = await this.getMatch(id);
    return updatedMatch;
  }

  // Match Events
  async getAllMatchEvents(): Promise<MatchEvent[]> {
    return db.select().from(matchEvents);
  }

  async getMatchEvent(id: string): Promise<MatchEvent | undefined> {
    const result = await db.select().from(matchEvents).where(eq(matchEvents.id, id));
    return result[0];
  }

  async getEventsByMatch(matchId: string): Promise<MatchEvent[]> {
    return db.select().from(matchEvents).where(eq(matchEvents.matchId, matchId));
  }

  async createMatchEvent(insertEvent: InsertMatchEvent): Promise<MatchEvent> {
    const result = await db.insert(matchEvents).values(insertEvent).returning();
    return result[0]!;
  }
}

export const storage = new DrizzleStorage();
