import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import NodeCache from "node-cache";
import dailyTerms from "../../data/daily_terms.json";

// Register Open Sans fonts
try {
  const regularFontPath = path.join(process.cwd(), "public", "fonts", "OpenSans-Regular.ttf");
  const boldFontPath = path.join(process.cwd(), "public", "fonts", "OpenSans-Bold.ttf");
  if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
    registerFont(regularFontPath, { family: "Open Sans", weight: "400" });
    registerFont(boldFontPath, { family: "Open Sans", weight: "700" });
    
  } else {
    console.warn("Open Sans font files not found; falling back to system fonts");
  }
} catch (e) {
  console.error("Error registering Open Sans fonts:", e);
}

// Cache for favicon and terms hash
let faviconCache = null;
let termsHashCache = null;

// Initialize cache (TTL: 1 hour = 3600 seconds)
const imageCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export default async function handler(req, res) {
  // Validate query parameter
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ message: "Invalid or missing date parameter (YYYY-MM-DD)" });
    return;
  }

  // Find term by date
  const term = dailyTerms.find((t) => t.date === date);
  if (!term) {
    res.status(404).json({ message: "Term not found" });
    return;
  }

  // Check dailyTerms.json hash for cache invalidation
  const termsContent = JSON.stringify(dailyTerms);
  const currentTermsHash = crypto.createHash("sha256").update(termsContent).digest("hex");
  if (termsHashCache && termsHashCache !== currentTermsHash) {
    imageCache.flushAll();
    
  }
  termsHashCache = currentTermsHash;

  // Check cache for PNG
  const cacheKey = `image:${date}:${currentTermsHash}`;
  const cachedBuffer = imageCache.get(cacheKey);
  if (cachedBuffer) {
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).end(cachedBuffer);
    return;
  }

  // Layout constants
  const maxWidth = 1200;
  const minWidth = 600;
  const aspectRatio = 1.91;
  const titleHeightBase = 80;
  const explanationTopBase = 140;
  const lineHeight = 42;
  const footerHeight = 60;
  const gap = 40;
  const topPadding = 20;
  const bottomPadding = 40;
  const maxTextWidthRatio = (maxWidth - 120) / maxWidth;

  // Calculate explanation lines
  const tempCanvas = createCanvas(1, 1);
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.font = "28px Open Sans, sans-serif";
  const maxTextWidth = maxWidth * maxTextWidthRatio;
  const explanationLines = getLineCount(tempCtx, term.fullExplanation, maxTextWidth);
  const contentHeightEstimate = titleHeightBase + (explanationLines * lineHeight) + gap + footerHeight + topPadding + bottomPadding;

  // Determine width
  let width;
  if (contentHeightEstimate <= 450) {
    width = 600;
  } else if (contentHeightEstimate <= 600) {
    width = 800;
  } else {
    width = 1200;
  }

  // Recalculate text width
  const textWidth = width * maxTextWidthRatio;
  tempCtx.font = "28px Open Sans, sans-serif";
  const finalExplanationLines = getLineCount(tempCtx, term.fullExplanation, textWidth);

  // Calculate height
  const explanationHeight = finalExplanationLines * lineHeight;
  const contentHeight = titleHeightBase + explanationHeight + gap + footerHeight + topPadding + bottomPadding;
  const minHeight = Math.ceil(width / aspectRatio);
  const height = Math.max(contentHeight, minHeight);

  // Determine title font size (always bold)
  let titleFontSize;
  if (width === 1200) {
    titleFontSize = 52;
  } else if (width === 800) {
    titleFontSize = 48;
  } else {
    titleFontSize = 44;
  }

  // Fine-tune title font size if it exceeds textWidth
  tempCtx.font = `bold ${titleFontSize}px Open Sans, sans-serif`;
  let titleMetrics = tempCtx.measureText(term.term);
  while (titleMetrics.width > textWidth && titleFontSize > 40) {
    titleFontSize -= 2;
    tempCtx.font = `bold ${titleFontSize}px Open Sans, sans-serif`;
    titleMetrics = tempCtx.measureText(term.term);
  }

  // Adjust titleHeight and explanationTop based on final font size
  const titleHeight = titleHeightBase * (titleFontSize / 52);
  const explanationTop = explanationTopBase * (titleFontSize / 52);

  // Recalculate content height with adjusted titleHeight
  const adjustedContentHeight = titleHeight + explanationHeight + gap + footerHeight + topPadding + bottomPadding;
  const adjustedHeight = Math.max(adjustedContentHeight, minHeight);

  // Create canvas with final dimensions
  const canvas = createCanvas(width, adjustedHeight);
  const ctx = canvas.getContext("2d");

  // Background: Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, adjustedHeight);
  gradient.addColorStop(0, "#f8fafe");
  gradient.addColorStop(1, "#e1e5f5");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, adjustedHeight);

  // Rounded border
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 3;
  roundRect(ctx, 0, 0, width, adjustedHeight, 24);
  ctx.stroke();

  // Term title (always bold)
  ctx.fillStyle = "#4f46e5";
  ctx.font = `bold ${titleFontSize}px Open Sans, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 4;
  ctx.fillText(term.term, 60, 60);
  ctx.shadowBlur = 0;

  // Full explanation
  ctx.fillStyle = "#374151";
  ctx.font = "28px Open Sans, sans-serif";
  let explanationY = explanationTop;
  const linesUsed = wrapText(ctx, term.fullExplanation, 60, explanationY, textWidth, lineHeight);
  explanationY += linesUsed * lineHeight;

  // Footer
  try {
    const logoSize = 48;
    const logoPadding = 20;
    const bottomY = explanationY + gap + (footerHeight / 2);
    let logo = faviconCache;

    if (!logo) {
      const faviconPath = path.join(process.cwd(), "public", "favicon.png");
      
      logo = await loadImage(faviconPath);
      faviconCache = logo;
    }

    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#6b7280";
    ctx.font = "24px Open Sans, sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 2;
    ctx.fillText(`Date: ${term.date}`, 60, bottomY);
    ctx.shadowBlur = 0;

    const websiteText = "DevExCode.com";
    ctx.textAlign = "right";
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 28px Open Sans, sans-serif";
    const websiteTextWidth = ctx.measureText(websiteText).width;
    const logoX = width - logoPadding - logoSize;
    const textX = logoX - 10;
    ctx.drawImage(logo, logoX, bottomY - logoSize / 2, logoSize, logoSize);
    ctx.shadowBlur = 2;
    ctx.fillText(websiteText, textX, bottomY);
    ctx.shadowBlur = 0;

    
  } catch (e) {
    console.error("Footer rendering error:", e);
    const bottomY = explanationY + gap + (footerHeight / 2);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#6b7280";
    ctx.font = "24px Open Sans, sans-serif";
    ctx.fillText(`Date: ${term.date}`, 60, bottomY);
    ctx.textAlign = "right";
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 28px Open Sans, sans-serif";
    ctx.fillText("DevExCode.com", width - 20, bottomY);
  }

  // Cache and send the image
  const buffer = canvas.toBuffer("image/png");
  imageCache.set(cacheKey, buffer);
  
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).end(buffer);
}

// Rounded rectangle helper
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

// Text wrap helper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let linesUsed = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
      linesUsed++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  linesUsed++;
  return linesUsed;
}

// Line count helper
function getLineCount(ctx, text, maxWidth) {
  const words = text.split(" ");
  let line = "";
  let linesUsed = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      line = words[i] + " ";
      linesUsed++;
    } else {
      line = testLine;
    }
  }
  linesUsed++;
  return linesUsed;
}