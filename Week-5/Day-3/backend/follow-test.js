const http = require('http');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0,
      },
    };
    if (token) opts.headers.Authorization = `Bearer ${token}`;
    const r = http.request(opts, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        try {
          const parsed = b ? JSON.parse(b) : null;
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: b });
        }
      });
    });
    r.on('error', (e) => reject(e));
    if (data) r.write(data);
    r.end();
  });
}

async function run() {
  console.log('follow test start');
  await req('POST', '/auth/register', {
    username: 'fA',
    email: 'fa@example.com',
    password: 'pass',
  }).catch(() => {});
  await req('POST', '/auth/register', {
    username: 'fB',
    email: 'fb@example.com',
    password: 'pass',
  }).catch(() => {});
  const la = await req('POST', '/auth/login', {
    email: 'fa@example.com',
    password: 'pass',
  });
  const lb = await req('POST', '/auth/login', {
    email: 'fb@example.com',
    password: 'pass',
  });
  const tokenA = la.body && la.body.token;
  const tokenB = lb.body && lb.body.token;
  console.log('tokens', !!tokenA, !!tokenB);
  // get user ids
  const ua =
    la.body && la.body.user && la.body.user.id
      ? la.body.user.id
      : (la.body && la.body.userId) || null;
  const ub =
    lb.body && lb.body.user && lb.body.user.id
      ? lb.body.user.id
      : (lb.body && lb.body.userId) || null;
  console.log('ids', ua, ub);
  const f1 = await req('POST', `/users/${ub}/follow`, null, tokenA);
  console.log('follow resp', f1.status, f1.body);
  const uaAfter = await req('GET', `/users/${ua}`);
  const ubAfter = await req('GET', `/users/${ub}`);
  console.log('ua after', uaAfter.body);
  console.log('ub after', ubAfter.body);
  const u1 = await req('POST', `/users/${ub}/unfollow`, null, tokenA);
  console.log('unfollow resp', u1.status, u1.body);
  const ubFinal = await req('GET', `/users/${ub}`);
  console.log('ub final', ubFinal.body);
}

run().catch((e) => console.error(e));
