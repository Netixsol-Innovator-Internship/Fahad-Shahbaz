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

  // Allow our local frontend during development and explicitly permit
  // credentials and common headers. We intentionally whitelist the dev
  // origin so the browser receives a concrete Access-Control-Allow-Origin
  // value (browsers reject '*' when credentials are used).
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  app.enableCors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = process.env.PORT || 3001;
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
