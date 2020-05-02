import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const { income, outcome } = transactions.reduce((previous, current) => {
      if (current.type === 'income') {
        previous.income += Number(current.value);
      } else {
        previous.outcome += Number(current.value);
      }
      return previous;
    }, balance);

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
