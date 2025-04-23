import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { tryParseNumber } from "@/lib/utils/type.util";

const CHUNK_SIZE = 1_000_000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "0";
    return await getVideoStream(request, tryParseNumber(id) ?? 0);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function getVideoStream(request: Request, videoId: number) {
  const range = request.headers.get("range");

  if (!range) {
    return new Response("Range header missing", { status: 400 });
  }

  const videoPath = path.resolve("./public", `videos/landing-${videoId}.mp4`);

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const chunkStart = Number(range.replace(/\D/g, "")) || 0;
  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, fileSize - 1);

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength.toString(),
    "Content-Type": "video/mp4",
  };

  const videoStream = fs.createReadStream(videoPath, {
    start: chunkStart,
    end: chunkEnd,
  });

  const stream = new ReadableStream({
    start(controller) {
      videoStream.on("data", (chunk) => controller.enqueue(chunk));
      videoStream.on("end", () => controller.close());
      videoStream.on("error", (err) => controller.error(err));
    },
  });

  const response = new Response(stream, { status: 206, headers });

  return response;
}
