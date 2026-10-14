import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import searchHandler from "./api/search.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// API route — the handler already uses Express-compatible req/res
app.get("/api/search", (req, res) => {
  searchHandler(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lacak.AI Pro server running on http://0.0.0.0:${PORT}`);
});
