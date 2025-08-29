import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
// import { NotificationModule } from './notification/notifications.module';
import { WishlistModule } from './wishlist/wishlists.module';
import { PaymentModule } from './payment/payments.module';
import { BidsModule } from './bids/bids.module';
import { AuctionModule } from './auction/auctions.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');
        // DEBUG: Remove this log after verifying MongoDB URI
        console.log('Loaded MongoDB URI:', uri);
        return {
          uri,
          connectionFactory: (connection: typeof import('mongoose')) => {
            // DEBUG: Remove this error handler after verifying connection
            if (connection && connection.connection) {
              connection.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
              });
              // DEBUG: Remove this event listener after verifying connection
              connection.connection.on('connected', () => {
                console.log('MongoDB connected successfully to Atlas!');
              });
            }
            // Log the connection if successful
            if (
              connection &&
              connection.connection &&
              Number(connection.connection.readyState) === 1
            ) {
              // readyState 1 means connected
              console.log('MongoDB connected successfully to Atlas!'); // DEBUG: Remove after verifying connection
            }
            return connection;
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    CarsModule,
    AuctionModule,
    BidsModule,
    PaymentModule,
    WishlistModule,
    CategoriesModule,
    // NotificationModule,
  ],
})
export class AppModule {}
