import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get("signIn")
	async signIn(@Query("password") password : string, @Query("username") username: string): Promise<any> {
		try {
			return await this.authService.signIn(username, password);
		} catch (error) {
			return error;
		}
	} 
}
