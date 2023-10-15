import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { HttpModule } from "@nestjs/axios"

@Module({
	imports: [UserModule, HttpModule],
	providers: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
