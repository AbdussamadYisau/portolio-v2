import { createStravaReader } from '../../lib/strava.mjs';
const readStrava = createStravaReader();
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return res.status(405).json({status:'method_not_allowed'}); }
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json(await readStrava());
}
