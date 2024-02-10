import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomsModule } from '../room/rooms.module';

import { ReservationsController } from './reservations.controller';
import { ReservationModel, ReservationModelSchema } from './reservation.model';
import { ReservationsService } from './reservations.service';

@Module({
	imports: [
		RoomsModule,
		MongooseModule.forFeature([
			{
				name: ReservationModel.name,
				schema: ReservationModelSchema,
			},
		]),
	],
	controllers: [ReservationsController],
	providers: [ReservationsService],
})
export class ReservationsModule {}
