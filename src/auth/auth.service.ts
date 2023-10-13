import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';

import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async signIn(username : string, pass: string): Promise<any> {
		const user = await this.userService.findOne(username);

		const hashed = await bcrypt.hash(pass, "a");

		console.log(user, user.password, hashed);

		if (!user || hashed !== user.password)
		{
			throw new UnauthorizedException();
		}

		const { password, ...ret} = user;

		return ret;
	}
}
