import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveProjectContent, retainPicturesOnError } from './content-state.mjs';

test('publishing an empty collection removes previous projects', () => {
  const previous = { projects: [{ name: 'Old project' }], source: 'sanity' };
  assert.deepEqual(resolveProjectContent({ status: 'ready', projects: [] }, previous), { projects: [], source: 'sanity' });
});

test('an unavailable CMS preserves fallback or previously published projects', () => {
  for (const source of ['fallback', 'sanity']) {
    const previous = { projects: [{ name: 'Project' }], source };
    assert.equal(resolveProjectContent(undefined, previous), previous);
    assert.equal(resolveProjectContent({ status: 'unavailable', projects: [] }, previous), previous);
  }
});

test('photo refresh errors preserve loaded photos, including repeated failures', () => {
  const previous = { status: 'ready', pictures: [{ id: 'photo' }] };
  const failed = retainPicturesOnError(previous);
  assert.equal(failed.pictures, previous.pictures);
  assert.equal(failed.refreshFailed, true);
  assert.deepEqual(retainPicturesOnError(failed), failed);
  assert.deepEqual(retainPicturesOnError({ status: 'loading', pictures: [] }), { status: 'unavailable', pictures: [] });
});
