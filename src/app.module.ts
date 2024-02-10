import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './database/mongo/config';
import { RoomsModule } from './room/rooms.module';
import { ReservationsModule } from './reservation/reservations.module';

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env' }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMongoConfig,
			inject: [ConfigService],
		}),
		RoomsModule,
		ReservationsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
