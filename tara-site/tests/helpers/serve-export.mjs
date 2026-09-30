import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Local, read-only server for the production static export. Never handles submissions.
const root = resolve("out");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }
  const pathname = decodeURIComponent(
    new URL(request.url, "http://localhost").pathname,
  );
  const path = resolve(root, `.${pathname}`);
  if (path !== root && !path.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  const candidates = extname(path)
    ? [path]
    : [`${path}.html`, resolve(path, "index.html")];
  for (const candidate of candidates) {
    try {
      const body = await readFile(candidate);
      response
        .writeHead(200, {
          "Content-Type":
            types[extname(candidate)] ?? "application/octet-stream",
        })
        .end(request.method === "HEAD" ? undefined : body);
      return;
    } catch {
      /* Try the next static route. */
    }
  }
  response.writeHead(404).end();
}).listen(3100, "127.0.0.1");
