import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewModel, ReviewSchema } from './review.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: ReviewModel.name, schema: ReviewSchema }])],
	providers: [ReviewService],
})
export class ReviewModule {}
