import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller("/users/")
export class UserController {
	constructor(private userService: UserService) {}

	@Get("/all")
	async findAll() {
		const users = await this.userService.findAll();

		if (!users.length)
			return ["None"];
		return users;
	}

	@Get("/user")
	async findOne(@Query("id") id: string | number) {
		return await this.userService.findOne(id);
	}

	@Post("/user")
	async addUser(@Body("user") user: User): Promise<string> {
		this.userService.addUser(user);
		return "success";
	}
}