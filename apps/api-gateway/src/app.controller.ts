import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('account') private accountQueue: Queue,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const job = await this.accountQueue.add('create', {
      name: 'Roma',
    });

    console.log(job.id);
    return this.appService.getHello();
  }
}
