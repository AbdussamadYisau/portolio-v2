import { createSpotifyReader } from '../../lib/spotify.mjs';
const readSpotify = createSpotifyReader();
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ status: 'method_not_allowed' }); }
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=30');
  return res.status(200).json(await readSpotify());
}
