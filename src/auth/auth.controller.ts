import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private service: AuthService) {}
	@Post(`register`)
	async register(@Body() dto: AuthDto) {
		return await this.service.create(dto);
	}

	@HttpCode(200)
	@Post(`login`)
	async login(@Body() dto: AuthDto) {}
}
