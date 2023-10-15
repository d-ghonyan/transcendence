import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	findOne(userName: string): Promise<User> {
		return this.userRepository.findOneBy({ userName });
	}

	async addUser(user: User) {
		// validation...

		user.password = await bcrypt.hash(user.password, 8);

		await this.userRepository.save(user);
	}
}