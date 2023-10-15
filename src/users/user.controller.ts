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

		return users.map((user) => {
			let { password, ...ret } = user;
			
			return ret;
		});
	}

	@Get("/user")
	async findOne(@Query("username") username: string) {
		return await this.userService.findOne(username);
	}

	@Post("/user")
	async addUser(@Body() user: User): Promise<string> {
		if (user) 
		{
			this.userService.addUser(user);
			return "success";
		}
		return "oh no";
	}
}