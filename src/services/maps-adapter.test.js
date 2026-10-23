import assert from 'node:assert/strict';
import test from 'node:test';
import { SCRAPER_PRESETS } from './apify.js';

test('Maps preset names a live Actor and johnvc limit key', () => {
  assert.equal(SCRAPER_PRESETS[0].id, 'johnvc~google-maps-places-api');
  assert.equal(SCRAPER_PRESETS[0].limitKey, 'maxResultsPerSearch');
  assert.notEqual(SCRAPER_PRESETS[0].id, 'apify~google-maps-scraper');
});
