import { Module } from '@nestjs/common';
import { AccountTaskService } from './account-task.service';
import { BullModule } from '@nestjs/bullmq';
import { UserRepoModule } from '@app/shared/repository/user/user.repo.module';
import { BankServiceModule } from '@app/shared/bank-service/bank-service.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UserRepoModule,
    BankServiceModule,
  ],
  providers: [AccountTaskService],
  exports: [AccountTaskService],
})
export class AccountTaskModule {}
