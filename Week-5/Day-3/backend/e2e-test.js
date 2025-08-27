const http = require('http');
const { io } = require('socket.io-client');

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
  console.log('Starting e2e test...');
  // register userA
  await req('POST', '/auth/register', {
    username: 'e2e_userA',
    email: 'e2e_userA@example.com',
    password: 'passA',
  }).catch((e) => console.error('reg A err', e));

  // register userB
  await req('POST', '/auth/register', {
    username: 'e2e_userB',
    email: 'e2e_userB@example.com',
    password: 'passB',
  }).catch((e) => console.error('reg B err', e));

  const la = await req('POST', '/auth/login', {
    email: 'e2e_userA@example.com',
    password: 'passA',
  });
  const lb = await req('POST', '/auth/login', {
    email: 'e2e_userB@example.com',
    password: 'passB',
  });

  console.log('login A response', la.status);
  console.log('login B response', lb.status);
  const tokenA = la.body && la.body.token ? la.body.token : null;
  const tokenB = lb.body && lb.body.token ? lb.body.token : null;
  console.log('tokenA', !!tokenA, 'tokenB', !!tokenB);

  if (!tokenA || !tokenB) {
    console.error('Missing tokens, aborting');
    process.exit(1);
  }

  // connect socket for A
  const socket = io('http://localhost:3001', {
    transports: ['websocket'],
    auth: { token: tokenA },
  });

  socket.on('connect', () => console.log('socket connected', socket.id));
  socket.on('notification:new', (p) => {
    console.log('socket notification:new', JSON.stringify(p, null, 2));
  });
  socket.on('connect_error', (err) =>
    console.error('socket connect_error', err && err.message),
  );

  // give socket a moment
  await new Promise((r) => setTimeout(r, 800));

  // create comment as A
  const commentResp = await req(
    'POST',
    '/comments',
    { content: 'hi from e2e', postId: 'post-e2e' },
    tokenA,
  );
  console.log('create comment status', commentResp.status, commentResp.body);
  // response may be { ok: true, comment: { ... } } or just the comment object
  const commentId =
    (commentResp.body && commentResp.body._id) ||
    (commentResp.body &&
      commentResp.body.comment &&
      commentResp.body.comment._id) ||
    null;
  if (!commentId) {
    console.error('No comment id, abort');
    socket.close();
    process.exit(1);
  }

  // like as B
  const likeResp = await req('POST', `/comments/${commentId}/like`, {}, tokenB);
  console.log('like status', likeResp.status, likeResp.body);

  // wait for socket event
  await new Promise((r) => setTimeout(r, 1200));

  // fetch notifications for A
  const nots = await req('GET', '/notifications', null, tokenA);
  console.log(
    'notifications for A',
    nots.status,
    JSON.stringify(nots.body, null, 2),
  );

  socket.close();
  process.exit(0);
}

run().catch((e) => {
  console.error('e2e error', e);
  process.exit(1);
});
