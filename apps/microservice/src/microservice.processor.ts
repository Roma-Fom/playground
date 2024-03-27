import { WorkerHostProcessor } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AccountTaskService } from './account-task/account-task.service';

@Processor('account', {
  concurrency: 100000,
})
@Injectable()
export class AccountProcessor extends WorkerHostProcessor {
  constructor(private readonly accountTaskService: AccountTaskService) {
    super();
  }
  async process(job: Job<unknown>): Promise<any> {
    const uuids = [
      'Pokémon',
      'Harry Potter',
      'The Lord of the Rings',
      'The Hobbit',
      'Star Wars',
      'The Chronicles of Narnia',
      'The Hunger Games',
      'The Da Vinci Code',
    ];
    const randomUuid = uuids[Math.floor(Math.random() * uuids.length)];
    await this.accountTaskService.createAccountOnBoardngFlow(randomUuid);
  }
}
