import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { HttpService } from "@nestjs/axios"

import bcrypt from 'bcrypt'

import * as dotenv from 'dotenv'

dotenv.config();

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private readonly httpService: HttpService) {
		this.getApiToken();
	}

	async getApiToken() {
		try {
			console.log(await this.httpService.axiosRef.post(process.env.INTRA_URL + "/oauth/token", {
				client_id: process.env.INTRA_UID,
				client_secret: process.env.INTRA_SECRET,
				grant_type: process.env.INTRA_GRANT_TYPE
			}));
		} catch (error) {
			console.log(error);
			
		}
	}

	async login(username: string, pass: string): Promise<any> {
		const user = await this.userService.findOne(username);

		if (!user || !(await bcrypt.compare(pass, user.password)))
		{
			throw new UnauthorizedException();
		}

		const { password, ...ret} = user;

		return ret;
	}
}
