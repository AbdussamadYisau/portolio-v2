import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, chmod } from 'node:fs/promises';

try { process.loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const id = process.env.SPOTIFY_CLIENT_ID, secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) { console.error('Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local first. See docs/integrations.md.'); process.exit(1); }
const redirect = 'http://127.0.0.1:4387/callback';
const state = randomBytes(32).toString('hex');
const auth = new URL('https://accounts.spotify.com/authorize');
auth.search = new URLSearchParams({ client_id: id, response_type: 'code', redirect_uri: redirect, state, scope: 'user-read-currently-playing user-read-recently-played' }).toString();
let handling = false;
const server = createServer(async (req, res) => {
  const url = new URL(req.url, redirect);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (url.pathname !== '/callback') { res.writeHead(404).end('Not found'); return; }
  const givenState = Buffer.from(url.searchParams.get('state') || '');
  if (givenState.length !== state.length || !timingSafeEqual(givenState, Buffer.from(state))) { res.writeHead(400).end('Invalid authorization state.'); return; }
  if (handling) { res.writeHead(409).end('Authorization already in progress.'); return; }
  if (!url.searchParams.get('code')) { res.writeHead(400).end('Authorization was not completed. You can close this tab.'); server.close(); clearTimeout(timeout); return; }
  handling = true;
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: redirect }), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (!data.refresh_token) throw new Error();
    const previous = await readFile('.env.local', 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error; });
    const line = `SPOTIFY_REFRESH_TOKEN=${JSON.stringify(data.refresh_token)}`;
    const next = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(previous) ? previous.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, () => line) : `${previous.trimEnd()}\n${line}\n`;
    await writeFile('.env.local', next, { mode: 0o600 });
    await chmod('.env.local', 0o600);
    res.end('Spotify connected. Close this tab and restart the portfolio dev server.');
    console.log('Spotify connected. Refresh token saved to ignored .env.local; restart your dev server.');
  } catch { res.writeHead(500).end('Connection failed. Check your app credentials and redirect URI, then rerun the helper.'); console.error('Spotify connection failed. No credentials have been printed.'); }
  finally { server.close(); clearTimeout(timeout); }
});
const timeout = setTimeout(() => { console.error('Authorization timed out. Run the helper again.'); server.close(); }, 10 * 60 * 1000);
server.on('error', () => { console.error('Cannot start authorization on 127.0.0.1:4387. Check whether the port is in use.'); clearTimeout(timeout); process.exitCode = 1; });
server.listen(4387, '127.0.0.1', () => console.log(`Open this URL in your browser to connect your Spotify account:\n${auth.href}\n\nWaiting for authorization (10 minutes). Press Ctrl+C to cancel.`));
