import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transactionExists = await transactionRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError("Transaction doesn't exist");
    }

    await transactionRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
