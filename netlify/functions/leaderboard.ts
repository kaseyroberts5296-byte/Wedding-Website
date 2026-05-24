import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { leaderboard } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const scores = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score))
      .limit(10);
    return Response.json(scores);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const playerName = String(body.playerName || "").trim().slice(0, 20);
    const score = parseInt(body.score, 10);
    const waveReached = parseInt(body.waveReached, 10);

    if (!playerName || isNaN(score) || isNaN(waveReached) || score < 0 || waveReached < 1) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const [entry] = await db
      .insert(leaderboard)
      .values({ playerName, score, waveReached })
      .returning();

    const topScores = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score))
      .limit(10);

    return Response.json({ entry, topScores }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/leaderboard",
};
