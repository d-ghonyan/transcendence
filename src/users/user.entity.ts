import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string | number;
  
	@Column()
	firstName: string;
  
	@Column()
	lastName: string;
  
	@Column({ default: true })
	isActive: boolean;
}