import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin', 'referee', 'viewer'
  name: text("name").notNull(),
});

export const sports = pgTable("sports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'basketball', 'football', 'cricket', etc.
  maxPlayers: integer("max_players").notNull(),
  scoringType: text("scoring_type").notNull(), // 'points', 'goals', 'runs'
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sportId: varchar("sport_id").notNull(),
  color: text("color").notNull(),
  photoUrl: text("photo_url"),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  points: integer("points").notNull().default(0),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  teamId: varchar("team_id").notNull(),
  number: integer("number").notNull(),
  position: text("position"),
  photoUrl: text("photo_url"),
  totalPoints: integer("total_points").notNull().default(0),
  totalGoals: integer("total_goals").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sportId: varchar("sport_id").notNull(),
  team1Id: varchar("team1_id").notNull(),
  team2Id: varchar("team2_id").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  venue: text("venue").notNull(),
  status: text("status").notNull(), // 'scheduled', 'live', 'completed', 'cancelled'
  team1Score: integer("team1_score").notNull().default(0),
  team2Score: integer("team2_score").notNull().default(0),
  winnerId: varchar("winner_id"),
});

export const matchEvents = pgTable("match_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull(),
  playerId: varchar("player_id"),
  teamId: varchar("team_id").notNull(),
  eventType: text("event_type").notNull(), // 'goal', 'point', 'foul', 'timeout'
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  description: text("description"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSportSchema = createInsertSchema(sports).omit({ id: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, wins: true, losses: true, points: true }).extend({ photoUrl: z.string().optional() });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true, totalPoints: true, totalGoals: true, gamesPlayed: true }).extend({ photoUrl: z.string().optional() });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, team1Score: true, team2Score: true, winnerId: true });
export const insertMatchEventSchema = createInsertSchema(matchEvents).omit({ id: true, timestamp: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Sport = typeof sports.$inferSelect;
export type InsertSport = z.infer<typeof insertSportSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type MatchEvent = typeof matchEvents.$inferSelect;
export type InsertMatchEvent = z.infer<typeof insertMatchEventSchema>;
