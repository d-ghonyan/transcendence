import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	private readonly users = [
		{
			id: 1,
			firstName: "barev",
			lastName: "barevlast",
			userName: "username1",
			password: "$2b$05$c8deQBPsoM2zuV00Q.LsGeJIDM8/aMmQcVuSwsmhTatdtFP55mSR.",
			isActive: true,
		},
		{
			id: 2,
			firstName: "barev",
			lastName: "barevlast",
			userName: "username2",
			password: '',
			isActive: true,
		},
	];

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find(user => user.userName === username);
	}
	
	constructor(
		// @InjectRepository(User)
		// private userRepository: Repository<User>,
	) {}

	// findAll(): Promise<User[]> {
	// 	return this.userRepository.find();
	// }

	// findOne(id: string | number): Promise<User> {
	// 	return this.userRepository.findOneBy({ id });
	// }

	// async addUser(user: User) {
	// 	await this.userRepository.save(user);
	// }
}