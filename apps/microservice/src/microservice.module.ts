import { Module } from '@nestjs/common';
import { MicroserviceController } from './microservice.controller';
import { MicroserviceService } from './microservice.service';
import { BullModule } from '@nestjs/bullmq';
import { AccountProcessor } from './microservice.processor';
import { AccountTaskModule } from './account-task/account-task.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'account',
      connection: {
        host: '0.0.0.0',
        port: 6379,
      },
    }),
    AccountTaskModule,
  ],
  controllers: [MicroserviceController],
  providers: [MicroserviceService, AccountProcessor],
})
export class MicroserviceModule {}
