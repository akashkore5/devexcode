import { createCanvas, loadImage } from "canvas";
import path from "path";
import dailyTerms from "../../data/daily_terms.json";

export default async function handler(req, res) {
  const { date } = req.query;
  const term = dailyTerms.find((t) => t.date === date);
  if (!term) {
    res.status(404).json({ message: "Term not found" });
    return;
  }

  const width = 1200;
  const height = 627;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background: Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#f8fafe");
  gradient.addColorStop(1, "#e1e5f5");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Rounded border
  ctx.strokeStyle = "#c7d2fe";
  ctx.lineWidth = 3;
  roundRect(ctx, 0, 0, width, height, 24);
  ctx.stroke();

  // Term title
  ctx.fillStyle = "#4f46e5";
  ctx.font = "bold 52px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(term.term, 60, 80);

  // Full explanation - wrapped
  ctx.fillStyle = "#374151";
  ctx.font = "28px sans-serif";
  const maxTextWidth = width - 120;
  let explanationY = 160;
  const lineHeight = 42;
  const linesUsed = wrapText(ctx, term.fullExplanation, 60, explanationY, maxTextWidth, lineHeight);
  explanationY += linesUsed * lineHeight;

  // Footer: Date on the left, logo and DevExCode.com on the right
  try {
    const logoSize = 48;
    const logoPadding = 20;
    const bottomY = height - 40;
    const logo = await loadImage(path.join(process.cwd(), "public", "favicon.svg"));

    // Date on the left
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "#6b7280";
    ctx.font = "24px sans-serif";
    ctx.fillText(`Date: ${term.date}`, 60, bottomY);

    // Logo and DevExCode.com on the right
    const websiteText = "DevExCode.com";
    ctx.textAlign = "right";
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 28px sans-serif";
    
    const websiteTextWidth = ctx.measureText(websiteText).width;
    const logoX = width - logoPadding - logoSize;
    const textX = logoX - 10;
    ctx.drawImage(logo, logoX, bottomY - logoSize / 2, logoSize, logoSize);
    ctx.fillText(websiteText, textX, bottomY);

  } catch (e) {
    console.error("Footer rendering error:", e);
    const bottomY = height - 40;
    ctx.textAlign = "right";
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("DevExCode.com", width - 20, bottomY);
  }

  // Convert and send the image
  const buffer = canvas.toBuffer("image/png");
  res.setHeader("Content-Type", "image/png");
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