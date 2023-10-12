import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	findOne(id: string | number): Promise<User> {
		return this.userRepository.findOneBy({ id });
	}

	async addUser(user: User) {
		await this.userRepository.save(user);
	}
}