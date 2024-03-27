import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { FlowProducer, Job, Queue, QueueEvents, Worker } from 'bullmq';
import { UserRepoService } from '@app/shared/repository/user';
import { BankService } from '@app/shared/bank-service/bank-service.service';

@Injectable()
export class AccountTaskService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly userRepo: UserRepoService,
    private readonly bankService: BankService,
  ) {}
  private workers: Record<string, Worker> = {};

  async onModuleInit() {
    console.log('Module initialized - workers can be setup here if needed');
  }

  async onModuleDestroy() {
    const workerKeys = Object.keys(this.workers);
    for (const key of workerKeys) {
      await this.workers[key].close();
    }
  }

  async createAccountOnBoardngFlow(accountId: string) {
    const accountQueueName = `account-${accountId}`;
    const bankAccountQueueName = `bank-account-${accountId}`;
    const flowProducer = new FlowProducer();
    await flowProducer.add({
      name: 'transferMoney',
      data: { accountId, amount: 100 },
      queueName: bankAccountQueueName,
      opts: {
        removeOnComplete: true,
      },
      children: [
        {
          name: 'createBankAccount',
          data: { accountId },
          queueName: bankAccountQueueName,
          opts: {
            removeOnComplete: true,
          },
          children: [
            {
              name: 'createUser',
              data: { accountId },
              queueName: accountQueueName,
              opts: {
                removeOnComplete: true,
              },
            },
          ],
        },
      ],
    });
    await this.addAccountDynamicQueue(accountId);
    await this.addBankDynamicQueue(accountId);
  }

  private async addAccountDynamicQueue(accountId: string) {
    const queueName = `account-${accountId}`;
    if (!this.workers[queueName]) {
      this.workers[queueName] = new Worker(
        queueName,
        async (job: Job<unknown>) => {
          switch (job.name) {
            case 'createUser':
              return await this.userRepo.create();
            case 'createUserPriority':
              return await this.userRepo.create();
            default:
              console.log('NOT IMPLEMENTED');
              throw new Error('NOT IMPLEMENTED');
          }
        },
        {
          concurrency: 1,
          connection: {
            host: 'localhost',
            port: 6379,
          },
        },
      );
      this.setupWorkerEventListeners(this.workers[queueName]);
    }
  }

  private async addBankDynamicQueue(accountId: string) {
    const queueName = `bank-account-${accountId}`;
    if (!this.workers[queueName]) {
      this.workers[queueName] = new Worker(
        queueName,
        async (job: Job<unknown>) => {
          switch (job.name) {
            case 'createBankAccount':
              return await this.bankService.createNewBankAccount();
            case 'transferMoney':
              return await this.bankService.transferMoney();
            default:
              console.log('NOT IMPLEMENTED');
              throw new Error('NOT IMPLEMENTED');
          }
        },
        {
          concurrency: 1,
          connection: {
            host: 'localhost',
            port: 6379,
          },
        },
      );
      this.setupWorkerEventListeners(this.workers[queueName]);
    }
  }

  private setupWorkerEventListeners(worker: Worker) {
    const queueEvents = new QueueEvents(worker.name);
    const logger = new Logger(worker.name);

    queueEvents.on('added', ({ jobId, name }) => {
      logger.debug(`Job ${jobId} added, name: ${name}`);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      logger.debug(
        `Job ${jobId} completed. with result: ${JSON.stringify(returnvalue)}`,
      );
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
      logger.error(
        `Job ${jobId} failed. with reason: ${JSON.stringify(failedReason)}`,
      );
    });

    queueEvents.on('drained', async () => {
      logger.verbose(`Queue ${worker.name} drained`);
      const queue = new Queue(worker.name);
      const jobs = queue.getJobCounts(
        'active',
        'completed',
        'failed',
        'delayed',
        'waiting',
        'paused',
        'waiting-children',
      );
      const hasJobs = Object.keys(jobs).some((key) => {
        return jobs[key] > 0;
      });
      if (!hasJobs) {
        await worker.close();
        await queueEvents.close();
        delete this.workers[worker.name];
      }
    });
    // console.log('Worker event listeners setup', this.workers);
  }
}
