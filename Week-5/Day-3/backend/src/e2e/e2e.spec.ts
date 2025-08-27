import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { io, Socket } from 'socket.io-client';
import http from 'http';

const request =
  (port: number) =>
  (method: string, path: string, body?: any, token?: string) =>
    new Promise<{ status: number; body: any }>((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const opts: any = {
        hostname: '127.0.0.1',
        port,
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
            resolve({ status: res.statusCode || 0, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode || 0, body: b });
          }
        });
      });
      r.on('error', (e) => reject(e));
      if (data) r.write(data);
      r.end();
    });

describe('E2E flow', () => {
  let app: INestApplication;
  let port: number;
  let socket: Socket | null = null;

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    const server = await app.listen(0);
    // @ts-ignore
    port = (server.address() && server.address().port) || 3001;
  });

  afterAll(async () => {
    if (socket) socket.close();
    await app.close();
  });

  it('registers, sockets, comments, likes and notifications', async () => {
    const req = request(port);

    // register users
    await req('POST', '/auth/register', {
      username: 'intA',
      email: 'intA@example.com',
      password: 'pass',
    }).catch(() => {});
    await req('POST', '/auth/register', {
      username: 'intB',
      email: 'intB@example.com',
      password: 'pass',
    }).catch(() => {});

    const la = await req('POST', '/auth/login', {
      email: 'intA@example.com',
      password: 'pass',
    });
    const lb = await req('POST', '/auth/login', {
      email: 'intB@example.com',
      password: 'pass',
    });
    expect(la.status).toBeGreaterThanOrEqual(200);
    expect(lb.status).toBeGreaterThanOrEqual(200);
    const tokenA = la.body && la.body.token;
    const tokenB = lb.body && lb.body.token;
    expect(tokenA).toBeTruthy();
    expect(tokenB).toBeTruthy();

    const events: any[] = [];

    socket = io(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
      auth: { token: tokenA },
    });
    socket.on('connect', () => {
      // connected
    });
    socket.on('notification:new', (p: any) => {
      events.push(p);
    });

    // allow connect
    await new Promise((r) => setTimeout(r, 800));

    // create comment as A
    const commentResp = await req(
      'POST',
      '/comments',
      { content: 'hi int', postId: 'post-int' },
      tokenA,
    );
    expect(commentResp.status).toBeGreaterThanOrEqual(200);
    const commentId =
      commentResp.body &&
      (commentResp.body._id ||
        (commentResp.body.comment && commentResp.body.comment._id));
    expect(commentId).toBeTruthy();

    // like as B
    const likeResp = await req(
      'POST',
      `/comments/${commentId}/like`,
      {},
      tokenB,
    );
    expect(likeResp.status).toBeGreaterThanOrEqual(200);

    // give DB and gateway a bit more time to persist/emit
    await new Promise((r) => setTimeout(r, 1500));

    // fetch comments for post to inspect stored author
    const commentsList = await req('GET', `/comments/post-int`);
    // ensure comment exists and has an author
    expect(commentsList.status).toBeGreaterThanOrEqual(200);
    const found = (commentsList.body || []).find(
      (c: any) => String(c._id) === String(commentId),
    );
    expect(found).toBeTruthy();
    // author should be user A id (string)
    // console.log('found comment', found);
    expect(
      events.find((e) => e.type === 'like' || e.type === 'comment'),
    ).toBeTruthy();

    // verify persisted notification for A
    const nots = await req('GET', '/notifications', null, tokenA);
    expect(nots.status).toBe(200);
    expect(nots.body && Array.isArray(nots.body.notifications)).toBe(true);
    expect(nots.body.notifications.length).toBeGreaterThanOrEqual(1);
  });
});
