import { Jimp } from "jimp";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import NodeCache from "node-cache";
import gfgProblems from "@/data/gfgproblems.json";
import matter from "gray-matter";
import { NextResponse } from "next/server";

// Initialize cache (TTL: 1 hour)
const imageCache = new NodeCache({ stdTTL: 3600 });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const lang = searchParams.get('lang');

    if (!id || !lang || !["java", "cpp", "python"].includes(lang)) {
      return NextResponse.json({ message: "Invalid or missing id or lang parameter" }, { status: 400 });
    }

    const problem = (gfgProblems as any[]).find((p) => p.id === parseInt(id, 10));
    if (!problem) {
      return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "gfgblogs", `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "Problem markdown file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(fileContent);

    const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
    const match = content.match(regex);
    const code = match ? match[1].trim() : "";
    if (!code) {
      return NextResponse.json({ message: `Code not found for language ${lang}` }, { status: 404 });
    }

    const contentHash = crypto.createHash("sha256").update(fileContent).digest("hex");
    const cacheKey = `share-code:${id}:${lang}:${contentHash}`;
    const cachedBuffer = imageCache.get(cacheKey) as Buffer;
    if (cachedBuffer) {
      return new Response(cachedBuffer, {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Design constants
    const width = 1200;
    const height = 800;
    
    // Create image
    const image = new Jimp({
        width,
        height,
        color: 0x1e293bff // Dark slate background (#1e293b)
    });

    // Load fonts
    const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const fontCode = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    const fontFooter = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

    // Draw header
    image.print({
        font: fontTitle,
        x: 60,
        y: 40,
        text: `${problem.id}. ${problem.title}`,
        maxWidth: 1000
    });

    image.print({
        font: fontTitle,
        x: 1000,
        y: 40,
        text: lang.toUpperCase(),
        maxWidth: 140
    });

    // Draw code background
    // (Jimp doesn't have a simple roundRect fill, so we'll just use a colored rectangle for simplicity in this recovery step)
    for (let x = 60; x < width - 60; x++) {
        for (let y = 120; y < height - 100; y++) {
            image.setPixelColor(0x2d3748ff, x, y);
        }
    }

    // Draw code
    image.print({
        font: fontCode,
        x: 80,
        y: 140,
        text: code,
        maxWidth: 1040
    });

    // Draw footer
    image.print({
        font: fontFooter,
        x: 60,
        y: 740,
        text: `GFG Problem #${problem.id} | DevExCode.com`,
        maxWidth: 1080
    });

    const buffer = await image.getBuffer("image/png");
    imageCache.set(cacheKey, buffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error generating share image (Jimp):", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
