import { Injectable } from '@nestjs/common';
import { AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(AuthModel.name)
		private authModel: Model<AuthModel>,
	) {}

	create(postData: AuthDto) {
		const createdPost = new this.authModel({
			...postData,
		});
		return createdPost.save();
	}
}
