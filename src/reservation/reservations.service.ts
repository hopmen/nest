import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import { RoomsService } from '../room/rooms.service';

import { ReservationModel } from './reservation.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

export interface ReservationPeriod {
	rentedFrom: Date;
	rentedTo: Date;
}

@Injectable()
export class ReservationsService {
	constructor(
		@InjectModel(ReservationModel.name) private readonly reservationModel: Model<ReservationModel>,
		private readonly roomsService: RoomsService,
	) {}

	async create(createScheduleDto: CreateReservationDto): Promise<Document<ReservationModel>> {
		const { roomId } = createScheduleDto;

		const room = await this.roomsService.findOneById(roomId);
		if (!room) {
			throw new NotFoundException();
		}

		const { rentedFrom, rentedTo } = this.rentedPeriodsToDates(createScheduleDto);

		const currentRoomReservations = await this.getRoomReservations(room.id, {
			rentedFrom,
			rentedTo,
		});

		if (currentRoomReservations.length) {
			throw new ConflictException();
		}

		return this.reservationModel.create({
			roomId: room._id,
			rentedFrom,
			rentedTo,
		});
	}

	findForRoom(roomId: string, dto) {
		return this.getRoomReservations(roomId, this.rentedPeriodsToDates(dto));
	}

	findOneById(reservationId: string) {
		return this.reservationModel.findById(reservationId).lean().exec();
	}

	async update(reservationId: string, dto: UpdateReservationDto) {
		const { rentedFrom, rentedTo, ...rest } = dto;
		const rentedPeriod = this.rentedPeriodsToDates({ rentedFrom, rentedTo });
		return this.reservationModel
			.findByIdAndUpdate(reservationId, { ...rentedPeriod, ...rest }, { returnDocument: 'after' })
			.lean()
			.exec();
	}

	delete(reservationId: string) {
		return this.reservationModel
			.findByIdAndDelete(reservationId, { returnDocument: 'after' })
			.lean()
			.exec();
	}

	async getRoomReservations(roomId: string, period?: Partial<ReservationPeriod>) {
		const query = this.reservationModel.find({
			roomId: roomId,
			isCanceled: false,
		});

		if (period?.rentedFrom && period?.rentedTo) {
			query.where({
				$or: [
					{ rentedFrom: { $gte: period.rentedFrom, $lte: period.rentedTo } },
					{ rentedTo: { $gte: period.rentedFrom, $lte: period.rentedTo } },
					{ rentedFrom: { $lt: period.rentedFrom }, rentedTo: { $gt: period.rentedTo } },
				],
			});
		} else if (period?.rentedFrom) {
			query.where({
				$or: [
					{ rentedFrom: { $gte: period.rentedFrom } },
					{ rentedTo: { $gte: period.rentedFrom } },
				],
			});
		} else if (period?.rentedTo) {
			query.where({
				$or: [{ rentedFrom: { $lte: period.rentedTo } }, { rentedTo: { $lte: period.rentedTo } }],
			});
		}

		return query.lean().exec();
	}

	private rentedPeriodsToDates(dto: Pick<CreateReservationDto, 'rentedFrom' | 'rentedTo'>) {
		const { rentedFrom, rentedTo } = dto;
		return {
			rentedFrom: dto.rentedFrom && new Date(new Date(rentedFrom).setUTCHours(0, 0, 0, 0)),
			rentedTo: dto.rentedTo && new Date(new Date(rentedTo).setUTCHours(23, 59, 59, 999)),
		};
	}
}
