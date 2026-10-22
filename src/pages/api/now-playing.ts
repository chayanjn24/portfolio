/**
 * What's playing on Spotify right now (or the last track played), for the top bar.
 * The only page that runs live; everything else is static. Secrets come from
 * environment variables (Vercel → Settings → Environment Variables, or .env locally)
 * and never reach the browser. Set them up with: npm run spotify:auth
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const env = (key: string): string | undefined => import.meta.env[key] ?? process.env[key];

interface Track {
  title: string;
  artist: string;
  url: string;
  cover?: string;
  album?: string;
}

async function accessToken(): Promise<string | null> {
  const id = env('SPOTIFY_CLIENT_ID');
  const secret = env('SPOTIFY_CLIENT_SECRET');
  const refresh = env('SPOTIFY_REFRESH_TOKEN');
  if (!id || !secret || !refresh) return null;
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token?: string }).access_token ?? null;
}

// Spotify's track and podcast-episode objects, trimmed to what we show.
function toTrack(item: any): Track | null {
  if (!item) return null;
  const artist = item.artists?.map((a: { name: string }) => a.name).join(', ') ?? item.show?.name ?? '';
  const imgs: { url: string }[] = item.album?.images ?? item.images ?? [];
  const cover = (imgs[1] ?? imgs[0])?.url;
  const big = imgs[0]?.url;
  return { title: item.name, artist, url: item.external_urls?.spotify ?? 'https://open.spotify.com', cover: big ?? cover, album: item.album?.name ?? item.show?.name };
}

const json = (body: object, maxAge: number) =>
  new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      // Vercel's edge cache shares one answer for 30 s, so Spotify is asked at most twice a minute.
      'Cache-Control': `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=60`,
    },
  });

export const GET: APIRoute = async () => {
  try {
    const token = await accessToken();
    if (!token) return json({ configured: false }, 300);
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    const now = await fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode', auth);
    if (now.status === 200) {
      const data = await now.json();
      const track = data.is_playing && data.currently_playing_type !== 'ad' ? toTrack(data.item) : null;
      if (track) return json({ configured: true, playing: true, ...track, progress: data.progress_ms, duration: data.item?.duration_ms }, 30);
    }

    const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', auth);
    if (recent.ok) {
      const track = toTrack((await recent.json()).items?.[0]?.track);
      if (track) return json({ configured: true, playing: false, ...track }, 60);
    }
    return json({ configured: true, playing: false }, 60);
  } catch {
    return json({ configured: false }, 60);
  }
};
