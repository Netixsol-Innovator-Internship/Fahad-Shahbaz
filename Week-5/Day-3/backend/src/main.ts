import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation and automatic transform for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Allow our local frontend during development. Accept any origin on
  // localhost or 127.0.0.1 (any port) so Next's dev server can pick a free
  // port (3000, 3001, 3002, etc.) without causing CORS failures.
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, mobile apps)
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        const host = url.hostname;
        if (host === 'localhost' || host === '127.0.0.1')
          return callback(null, true);
      } catch (e) {
        // fallthrough to rejection
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = 3001;
  await app.listen(port);
  console.log(`HTTP server on http://localhost:${port}`);

  // mongoose connection status
  try {
    const conn = mongoose.connection;
    conn.once('open', () => console.log('Mongoose connected'));
    conn.on('error', (err) => console.error('Mongoose connection error', err));
  } catch (err) {
    console.warn(
      'Mongoose connection listener not attached',
      err?.message || err,
    );
  }
}
bootstrap();
