import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from './auth.model';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [MongooseModule.forFeature([{ name: 'AuthModel', schema: AuthSchema }])],
})
export class AuthModule {}
