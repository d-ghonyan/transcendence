import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';

import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async signIn(username: string, pass: string): Promise<any> {
		const user = await this.userService.findOne(username);

		if (!user || !(await bcrypt.compare(pass, user.password)))
		{
			throw new UnauthorizedException();
		}

		const { password, ...ret} = user;

		return ret;
	}
}
