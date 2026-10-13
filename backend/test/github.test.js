const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fetchUserRepositories, fetchUserEvents } = require('../services/github/githubApi');
const { analyzeGithubProfile } = require('../services');
const { inFlightAnalyses } = require('../services/cache/cacheService');

test('repositories paginate and encode usernames', async (t) => {
  const urls = [];
  t.mock.method(global, 'fetch', async (url) => {
    urls.push(url);
    return Response.json(urls.length === 1 ? Array.from({ length: 100 }, (_, id) => ({ id })) : [{ id: 100 }]);
  });
  const repos = await fetchUserRepositories('a/b');
  assert.equal(repos.length, 101);
  assert.match(urls[0], /a%2Fb\/repos.*page=1/);
  assert.match(urls[1], /page=2/);
});

for (const status of [403, 429]) {
  test(`GitHub ${status} becomes a rate-limit error with retry metadata`, async (t) => {
    t.mock.method(global, 'fetch', async () => new Response(null, {
      status, headers: { 'Retry-After': '60' }
    }));
    await assert.rejects(fetchUserRepositories('limited'), (error) => {
      assert.equal(error.statusCode, 429);
      assert.equal(error.retryAfter, '60');
      return true;
    });
  });
}

test('missing users and upstream errors remain explicit failures', async (t) => {
  for (const status of [404, 502]) {
    const mock = t.mock.method(global, 'fetch', async () => new Response(null, { status }));
    await assert.rejects(fetchUserRepositories('missing'), { statusCode: status });
    mock.mock.restore();
  }
});

test('event failures preserve previously fetched activity', async (t) => {
  const events = Array.from({ length: 100 }, () => ({ created_at: new Date().toISOString() }));
  let calls = 0;
  t.mock.method(global, 'fetch', async () => ++calls === 1
    ? Response.json(events) : new Response(null, { status: 429 }));
  assert.deepEqual(await fetchUserEvents('partial'), events);
  assert.equal(calls, 2);
});

test('concurrent analyses share upstream calls and cache usernames without case sensitivity', async (t) => {
  let calls = 0;
  t.mock.method(global, 'fetch', async () => {
    calls += 1;
    return Response.json([]);
  });
  const [first, second] = await Promise.all([
    analyzeGithubProfile('ConcurrentFixture'), analyzeGithubProfile('concurrentfixture')
  ]);
  assert.equal(calls, 2);
  assert.equal(first.cacheHit, false);
  assert.equal(second.cacheHit, true);
  assert.deepEqual(first.data, second.data);
  assert.equal(inFlightAnalyses.size, 0);
  assert.equal((await analyzeGithubProfile('CONCURRENTFIXTURE')).cacheHit, true);
  assert.equal(calls, 2);
});

test('failed analyses release in-flight state and can be retried', async (t) => {
  let failed = true;
  t.mock.method(global, 'fetch', async () => failed
    ? new Response(null, { status: 502 }) : Response.json([]));
  await assert.rejects(analyzeGithubProfile('retryfixture'), { statusCode: 502 });
  assert.equal(inFlightAnalyses.has('retryfixture'), false);
  failed = false;
  assert.equal((await analyzeGithubProfile('retryfixture')).cacheHit, false);
});
