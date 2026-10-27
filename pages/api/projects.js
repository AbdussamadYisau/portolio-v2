import { getProjects } from '../../lib/sanity.mjs';
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ status: 'method_not_allowed' }); }
  try {
    const data = await getProjects();
    res.setHeader('Cache-Control', data.status === 'ready' ? 'public, s-maxage=60, stale-while-revalidate=120' : 'no-store');
    return res.status(200).json(data);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ status: 'unavailable', projects: [] });
  }
}
