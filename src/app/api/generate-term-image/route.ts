import { Jimp } from "jimp";
import dailyTerms from "../../../data/daily_terms.json";
import { NextResponse } from "next/server";
import NodeCache from "node-cache";

// Initialize cache (TTL: 1 hour)
const imageCache = new NodeCache({ stdTTL: 3600 });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ message: "Invalid or missing date parameter" }, { status: 400 });
    }

    const term = (dailyTerms as any[]).find((t) => t.date === date);
    if (!term) {
      return NextResponse.json({ message: "Term not found" }, { status: 404 });
    }

    const cacheKey = `jimp_image:${date}`;
    const cachedBuffer = imageCache.get(cacheKey) as Buffer;
    if (cachedBuffer) {
      return new Response(cachedBuffer, {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    }

    // Create a new image with Jimp (1200x630)
    const image = new Jimp({
        width: 1200,
        height: 630,
        color: 0xf8fafeff // Background color (#f8fafe)
    });

    // Load fonts (Jimp uses Bitmap fonts)
    const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const fontText = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    // Draw the term title
    image.print({
        font: fontTitle,
        x: 60,
        y: 60,
        text: term.term,
        maxWidth: 1080
    });

    // Draw the explanation
    image.print({
        font: fontText,
        x: 60,
        y: 180,
        text: term.fullExplanation,
        maxWidth: 1080
    });

    // Draw the footer (website name)
    const fontFooter = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print({
        font: fontFooter,
        x: 60,
        y: 550,
        text: `DevExCode.com | ${date}`,
        maxWidth: 1080
    });

    // Get the buffer
    const buffer = await image.getBuffer("image/png");
    imageCache.set(cacheKey, buffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Daily term image (Jimp) API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
