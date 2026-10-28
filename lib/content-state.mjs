export function resolveProjectContent(data, previous) {
  return data?.status === 'ready' && Array.isArray(data.projects)
    ? { projects: data.projects, source: 'sanity' }
    : previous;
}

export function retainPicturesOnError(previous) {
  return previous.status === 'ready'
    ? { ...previous, refreshFailed: true }
    : { status: 'unavailable', pictures: [] };
}
