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
  // ensure users exist and one follows the other to produce a notification
  await req('POST', '/auth/register', {
    username: 'mA',
    email: 'ma@example.com',
    password: 'pass',
  }).catch(() => {});
  await req('POST', '/auth/register', {
    username: 'mB',
    email: 'mb@example.com',
    password: 'pass',
  }).catch(() => {});
  const la = await req('POST', '/auth/login', {
    email: 'ma@example.com',
    password: 'pass',
  });
  const lb = await req('POST', '/auth/login', {
    email: 'mb@example.com',
    password: 'pass',
  });
  const tokenA = la.body && la.body.token;
  const tokenB = lb.body && lb.body.token;
  // A follows B
  const ub =
    lb.body && lb.body.user && lb.body.user.id
      ? lb.body.user.id
      : lb.body && lb.body.userId;
  await req('POST', `/users/${ub}/follow`, null, tokenA);
  // fetch notifications for B
  const nots = await req('GET', '/notifications', null, tokenB);
  console.log(
    'notifications for B',
    nots.status,
    JSON.stringify(nots.body, null, 2),
  );
  const markAll = await req('POST', `/notifications/read-all`, null, tokenB);
  console.log('mark all read', markAll.status, markAll.body);
}

run().catch((e) => console.error(e));
