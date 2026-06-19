import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = parseInt(process.env.PORT || "80", 10);
const HOST = process.env.HOST || "0.0.0.0";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "dist", "client");

// MIME types for static files
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

// Import the built TanStack Start SSR handler
const { default: server } = await import("./dist/server/server.js");

function serveStatic(urlPath, res) {
  // Normalize path to prevent directory traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(CLIENT_DIR, safePath);

  if (!filePath.startsWith(CLIENT_DIR)) {
    return false;
  }

  try {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return false;
    }
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

// Create HTTP server using the SSR fetch handler
const httpServer = http.createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url ?? "/", `http://${HOST}`).pathname;

    // Try to serve static files first
    if (serveStatic(urlPath, res)) {
      return;
    }

    // For root, also try index.html
    if (urlPath === "/" || urlPath === "") {
      if (serveStatic("/index.html", res)) {
        return;
      }
    }

    // Build a standard Request from Node IncomingMessage
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host || `${HOST}:${PORT}`;
    const url = new URL(req.url ?? "/", `${protocol}://${host}`);

    // Collect body
    const body = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
    });

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: body.length > 0 ? body : undefined,
    });

    const response = await server.fetch(request, {}, {});

    // Write response status, headers, body
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Skip transfer-encoding as Node handles it
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });
    const responseBody = await response.arrayBuffer();
    res.end(Buffer.from(responseBody));
  } catch (error) {
    console.error("Request error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Happy Smile server running on http://${HOST}:${PORT}`);
});