import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	async login(@Body() body): Promise<any> {
		try {
			return await this.authService.login(body.username, body.password);
		} catch (error) {
			return error;
		}
	} 
}
