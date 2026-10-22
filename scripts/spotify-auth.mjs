#!/usr/bin/env node
/**
 * One-time Spotify login for the "now playing" bar. Run: npm run spotify:auth
 *
 * Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env (from your app at
 * developer.spotify.com, with Redirect URI  http://127.0.0.1:8888/callback ).
 * Opens Spotify's login page, receives the answer on this machine, and writes
 * SPOTIFY_REFRESH_TOKEN into .env. Nothing is sent anywhere except Spotify.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { exec } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const ENV_FILE = new URL('../.env', import.meta.url);
const REDIRECT = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const readEnv = () =>
  Object.fromEntries(
    (existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
  );

const env = readEnv();
const id = env.SPOTIFY_CLIENT_ID;
const secret = env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error('✗ Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first (copy .env.example to .env).');
  process.exit(1);
}

const state = randomBytes(12).toString('hex');
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({ response_type: 'code', client_id: id, scope: SCOPES, redirect_uri: REDIRECT, state });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  if (!code || url.searchParams.get('state') !== state) {
    res.writeHead(400).end('Login failed or was cancelled. You can close this tab.');
    return finish(1, '✗ No code received (login cancelled?).');
  }
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    res.writeHead(500).end('Spotify did not return a token. Check the terminal.');
    return finish(1, `✗ Spotify said: ${JSON.stringify(data)}`);
  }
  const lines = (existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '').split('\n').filter((l) => !l.startsWith('SPOTIFY_REFRESH_TOKEN='));
  lines.push(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
  writeFileSync(ENV_FILE, lines.filter((l, i, a) => l || i < a.length - 1).join('\n') + '\n');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end('<h2>✓ Done — you can close this tab.</h2>');
  finish(0, '✓ Saved SPOTIFY_REFRESH_TOKEN to .env. Next: add the same three values in Vercel → Settings → Environment Variables.');
});

function finish(code, message) {
  console.log(message);
  server.close();
  setTimeout(() => process.exit(code), 100);
}

server.listen(8888, '127.0.0.1', () => {
  console.log('Opening Spotify login… If nothing opens, visit:\n' + authUrl);
  exec(`open "${authUrl}"`);
});
