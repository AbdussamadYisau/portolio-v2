import { defineQuery } from 'groq';
import { createImageUrlBuilder } from '@sanity/image-url';

export const PICTURES_QUERY = defineQuery(/* groq */ `
  *[_type == "picture" && defined(image.asset) && !(_id in path("drafts.**"))]
  | order(displayOrder asc, _createdAt desc, _id asc)[0...12] {
    _id, title, caption, location, instagramUrl,
    image { alt, crop, hotspot, asset->{_id, url, metadata{dimensions{width, height}}} }
  }
`);
export async function getPictures({ env = process.env, request = fetch } = {}) {
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  if (!projectId) return { status: 'unconfigured', pictures: [] };
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-zA-Z0-9_-]+$/.test(dataset)) throw new Error('Invalid Sanity configuration');
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2026-10-24/data/query/${dataset}`);
  url.searchParams.set('query', PICTURES_QUERY);
  url.searchParams.set('perspective', 'published');
  const response = await request(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Photo journal unavailable');
  const { result } = await response.json();
  if (!Array.isArray(result)) throw new Error('Invalid photo response');
  const builder = createImageUrlBuilder({ projectId, dataset });
  return { status: 'ready', pictures: result.filter(item => item.image?.asset?._id).map(item => ({
    id: item._id, title: item.title || '', caption: item.caption || '', location: typeof item.location === 'string' ? item.location : '',
    alt: item.image.alt || item.title || 'Photo from Abdussamad’s journal',
    thumbnail: builder.image(item.image).width(720).auto('format').url(),
    full: builder.image(item.image).width(1800).auto('format').url(),
    width: item.image.asset.metadata?.dimensions?.width || 720,
    height: item.image.asset.metadata?.dimensions?.height || 900,
  })) };
}
