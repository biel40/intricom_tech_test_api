import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileSystemService } from './modules/services/file_system.service';
import { ClientController } from './modules/controllers/client.controller';
import { ClientService } from './modules/services/client.service';
import { Client } from './modules/models/database/client.entity';
import { Hotel } from './modules/models/database/hotel.entity';
import { HotelBooking } from './modules/models/database/hotel_booking.entity';
import { HotelService } from './modules/services/hotel.service';
import { HotelController } from './modules/controllers/hotel.controller';
import { HotelBookingService } from './modules/services/hotel_booking.service';
import { HotelBookingController } from './modules/controllers/hotel_booking.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        Client,
        Hotel,
        HotelBooking
      ],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Client,
      Hotel,
      HotelBooking
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [
    ClientController,
    HotelController,
    HotelBookingController
  ],
  providers: [
    FileSystemService,
    ClientService,
    HotelService,
    HotelBookingService
  ],
})
export class AppModule { }
