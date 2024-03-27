import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepoService {
  constructor() {}

  async create() {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: '1', name: 'John Doe' });
      }, 5000);
    });
  }
}
