import sharp from "sharp";
import { mkdirSync } from "fs";

const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#080910" rx="192"/>
  <circle cx="400" cy="400" r="200" fill="none" stroke="#ffb51b" stroke-width="56"/>
  <line x1="550" y1="550" x2="780" y2="780" stroke="#ffb51b" stroke-width="56" stroke-linecap="round"/>
</svg>`
);

mkdirSync("icons", { recursive: true });
mkdirSync("resources", { recursive: true });

for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`icons/icon-${size}.png`);
}

await sharp(svg).resize(1024, 1024).png().toFile("resources/icon.png");

console.log("Icons generated successfully");
