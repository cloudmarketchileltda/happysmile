import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = parseInt(process.env.PORT || "80", 10);
const HOST = process.env.HOST || "0.0.0.0";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

let serverHandler;

async function getHandler() {
  if (!serverHandler) {
    const mod = await import("./dist/server/server.js");
    serverHandler = mod.default || mod;
  }
  return serverHandler;
}

function serveStatic(urlPath, res) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(CLIENT_DIR, safePath);

  if (!filePath.startsWith(CLIENT_DIR)) return false;

  try {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "content-type": contentType, "content-length": content.length });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

const httpServer = http.createServer(async (req, res) => {
  try {
    const urlObj = new URL(req.url || "/", `http://${HOST}`);
    const urlPath = urlObj.pathname;

    // Serve static files first
    if (serveStatic(urlPath, res)) return;

    // Build Request for SSR handler
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["host"] || `${HOST}:${PORT}`;
    const url = new URL(req.url || "/", `${protocol}://${host}`);

    const body = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: body.length > 0 ? body : undefined,
    });

    const handler = await getHandler();
    const response = await handler.fetch(request, {}, {});

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });

    const responseBody = await response.arrayBuffer();
    res.end(Buffer.from(responseBody));
  } catch (error) {
    console.error("Request error:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "text/html; charset=utf-8" });
    }
    res.end("<!DOCTYPE html><html><body><h1>Error interno del servidor</h1></body></html>");
  }
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Happy Smile server running on http://${HOST}:${PORT}`);
});
