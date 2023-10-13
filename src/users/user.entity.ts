import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string | number;
  
	@Column()
	userName: string;

	@Column()
	firstName: string;
  
	@Column()
	lastName: string;

	@Column()
	password: string;

	@Column({ default: true })
	isActive: boolean;
}