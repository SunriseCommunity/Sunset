import { NextResponse } from "next/server";

import type { UserResponse } from "@/lib/types/api";
import { BeatmapStatusWeb, UserBadge } from "@/lib/types/api";
import { tryParseNumber } from "@/lib/utils/type.util";

const statusMap: Record<number, BeatmapStatusWeb> = {
  0: BeatmapStatusWeb.GRAVEYARD,
  1: BeatmapStatusWeb.PENDING,
  2: BeatmapStatusWeb.RANKED,
  3: BeatmapStatusWeb.APPROVED,
  4: BeatmapStatusWeb.QUALIFIED,
  5: BeatmapStatusWeb.LOVED,
};

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.slice(7);

    const apiBaseUrl = `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`;
    const userResponse = await fetch(`${apiBaseUrl}/user/self`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 },
      );
    }

    const user: UserResponse = await userResponse.json();

    if (!user.badges.includes(UserBadge.BAT)) {
      return NextResponse.json(
        { error: "Forbidden: BAT role required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const beatmapId = searchParams.get("beatmapId");

    if (!beatmapId) {
      return NextResponse.json(
        { error: "Missing beatmapId parameter" },
        { status: 400 },
      );
    }

    const parsedBeatmapId = tryParseNumber(beatmapId);
    if (!parsedBeatmapId) {
      return NextResponse.json(
        { error: "Invalid beatmapId parameter" },
        { status: 400 },
      );
    }

    const akatsukiResponse = await fetch(
      `https://akatsuki.gg/api/v1/beatmaps?b=${parsedBeatmapId}`,
      {
        credentials: "omit",
      },
    );

    if (!akatsukiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Akatsuki" },
        { status: akatsukiResponse.status },
      );
    }

    const akatsukiData: { ranked: number } = await akatsukiResponse.json();
    const suggestedStatus = statusMap[akatsukiData?.ranked] || null;

    return NextResponse.json({
      ranked: akatsukiData?.ranked,
      suggestedStatus: suggestedStatus || null,
    });
  }
  catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
