import { Injectable } from '@nestjs/common';

@Injectable()
export class BankService {
  constructor() {}

  async createNewBankAccount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('new bank account created');
      }, 5000);
    });
  }

  async transferMoney() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('money transferred');
      }, 5000);
    });
  }
}
