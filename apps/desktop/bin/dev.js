import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const desktopRoot = path.resolve(__dirname, '..');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url || '/';
  if (reqUrl === '/') reqUrl = '/index.html';

  let filePath = path.normalize(path.join(desktopRoot, reqUrl));

  // If path goes up to workspace root (e.g. /packages/...)
  const workspaceRoot = path.resolve(desktopRoot, '../..');
  if (!fs.existsSync(filePath)) {
    const candidateWorkspacePath = path.normalize(path.join(workspaceRoot, reqUrl));
    if (fs.existsSync(candidateWorkspacePath) && fs.statSync(candidateWorkspacePath).isFile()) {
      filePath = candidateWorkspacePath;
    }
  }

  // Fallback for SPA routing if file still not found
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(desktopRoot, 'index.html');
  }


  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`  LOGICFORGE DESKTOP IDE v1.0.0 RUNNING`);
  console.log(`  Local Access URL: http://localhost:${PORT}`);
  console.log(`========================================================\n`);
});

