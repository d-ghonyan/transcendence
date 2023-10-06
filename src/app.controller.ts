import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller(["/barev", "/hello"])
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/barev")
  getKov(): string {
	  return this.appService.getBarev();
  }
}
