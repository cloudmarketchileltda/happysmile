import http from "node:http";

const PORT = parseInt(process.env.PORT || "80", 10);
const HOST = process.env.HOST || "0.0.0.0";

// Import the built TanStack Start SSR handler
const { default: server } = await import("./dist/server/server.js");

// Create HTTP server using the SSR fetch handler
const httpServer = http.createServer(async (req, res) => {
  try {
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
  console.log(`Server running on http://${HOST}:${PORT}`);
});