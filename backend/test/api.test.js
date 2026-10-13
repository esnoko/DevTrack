const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const app = require('../server');

// Use http rather than fetch for local requests so the GitHub fetch mock stays isolated.
const request = (server, path) => new Promise((resolve, reject) => {
  http.get({ hostname: '127.0.0.1', port: server.address().port, path }, (response) => {
    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { body += chunk; });
    response.on('end', () => resolve({ status: response.statusCode,
      headers: response.headers, body: JSON.parse(body) }));
    response.on('error', reject);
  }).on('error', reject);
});

test('HTTP API preserves success, cache, health, and failure contracts', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  await once(server, 'listening');
  let upstreamStatus = 200;
  t.mock.method(global, 'fetch', async () => upstreamStatus === 200
    ? Response.json([]) : new Response(null, { status: upstreamStatus }));

  const health = await request(server, '/api/v1/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.data.status, 'ok');

  const first = await request(server, '/api/v1/github/ApiFixture');
  assert.equal(first.status, 200);
  assert.equal(first.body.success, true);
  assert.equal(first.headers['x-cache'], 'MISS');
  assert.equal(first.body.meta.cached, false);
  assert.ok(Number.isFinite(Date.parse(first.body.meta.timestamp)));
  assert.equal(first.body.data.username, 'ApiFixture');
  assert.equal(first.body.data.hireabilityScore, 0);
  assert.equal(first.body.data.commitActivity.length, 12);
  assert.equal(first.body.data.scoreBreakdown.length, 4);
  assert.ok(Array.isArray(first.body.data.languageBreakdown));
  assert.deepEqual(Object.keys(first.body.data.insights.roleFit).sort(), ['backend', 'frontend', 'fullstack']);

  const cached = await request(server, '/api/v1/github/apifixture');
  assert.equal(cached.headers['x-cache'], 'HIT');
  assert.equal(cached.body.meta.cached, true);
  assert.deepEqual(cached.body.data, first.body.data);

  for (const status of [404, 429, 502]) {
    upstreamStatus = status;
    const failed = await request(server, `/api/v1/github/failure${status}`);
    assert.equal(failed.status, status);
    assert.equal(failed.body.success, false);
    assert.equal(failed.body.error.statusCode, status);
    assert.equal(typeof failed.body.error.message, 'string');
  }

  assert.equal((await request(server, '/api/v1/github/%20')).status, 400);
  assert.equal((await request(server, '/unknown')).status, 404);
});
