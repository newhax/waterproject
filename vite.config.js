import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function readJsonBody(req, limit = 6 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) reject(new Error('Body too large'));
      else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

/**
 * Serves /api/*.js with Vercel-style (req, res) handlers during `npm run dev`,
 * so you don't need `vercel dev` locally. Production uses real Vercel functions.
 */
function apiDevMiddleware() {
  return {
    name: 'jalmitra-api-dev',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+/, '');
        if (!/^[a-z-]+$/.test(name)) return next();
        const send = (code, obj) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
        };
        let mod;
        try {
          mod = await server.ssrLoadModule(`/api/${name}.js`);
        } catch {
          return send(404, { error: `No API route /api/${name}` });
        }
        try {
          req.body = req.method === 'POST' ? await readJsonBody(req) : undefined;
          const shim = {
            status(code) {
              res.statusCode = code;
              return shim;
            },
            json(obj) {
              send(res.statusCode || 200, obj);
              return shim;
            },
            setHeader: (k, v) => res.setHeader(k, v),
          };
          await mod.default(req, shim);
        } catch (e) {
          send(500, { error: e.message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose server-only vars (e.g. ANTHROPIC_API_KEY) to the dev API middleware.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), apiDevMiddleware()],
    server: { port: 5173, host: true },
  };
});
