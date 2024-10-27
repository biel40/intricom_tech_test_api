import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './modules/controllers/app.controller';
import { AppService } from './modules/services/app.service';
import { FileSystemService } from './modules/services/file_system.service';
import { ClientController } from './modules/controllers/client.controller';
import { ClientService } from './modules/services/client.service';
import { Client } from './modules/models/database/client.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        Client
      ],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Client
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [
    AppController,
    ClientController
  ],
  providers: [
    AppService, 
    FileSystemService,
    ClientService
  ],
})
export class AppModule { }
