import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		// TypeOrmModule.forRoot({
		// 	type: "postgres",
		// 	host: "postgres",
		// 	port: parseInt(process.env.POSTGRES_PORT) || 5432,
		// 	database: process.env.POSTGRES_DB || "test",
		// 	username: process.env.POSTGRES_USER || "root",
		// 	password: process.env.POSTGRES_PASSWORD || "root",
		// 	entities: [User],
		// 	synchronize: true,
		// }),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	// constructor(private dataSource: DataSource) {}
	
}
