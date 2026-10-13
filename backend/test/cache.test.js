const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getCachedAnalysis, setCachedAnalysis } = require('../services/cache/cacheService');

test('cache misses return null and entries expire exactly at their TTL', (t) => {
  const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || 300);
  const ttl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds * 1000 : 300000;
  let now = 1000000;
  t.mock.method(Date, 'now', () => now);
  assert.equal(getCachedAnalysis('missing'), null);
  const data = { username: 'cache-fixture' };
  setCachedAnalysis('cache-fixture', data);
  assert.deepEqual(getCachedAnalysis('cache-fixture'), data);
  now += ttl - 1;
  assert.deepEqual(getCachedAnalysis('cache-fixture'), data);
  now += 1;
  assert.equal(getCachedAnalysis('cache-fixture'), null);
  now -= ttl;
  assert.equal(getCachedAnalysis('cache-fixture'), null);
});
