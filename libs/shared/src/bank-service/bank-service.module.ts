import { Module } from '@nestjs/common';
import { BankService } from '@app/shared/bank-service/bank-service.service';

@Module({
  providers: [BankService],
  exports: [BankService],
})
export class BankServiceModule {}
