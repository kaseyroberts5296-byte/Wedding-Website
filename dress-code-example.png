import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const leaderboard = pgTable("leaderboard", {
  id: serial().primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer().notNull(),
  waveReached: integer("wave_reached").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
