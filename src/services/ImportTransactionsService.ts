import fs from 'fs';
import csvParse from 'csv-parse';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  path: string;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ path }: Request): Promise<Transaction[]> {
    const csvStream = fs.createReadStream(path);

    const parseStream = csvParse({
      from_line: 2,
      rtrim: true,
      ltrim: true,
    });

    const csvParsed = csvStream.pipe(parseStream);

    const registers: TransactionDTO[] = [];

    csvParsed.on('data', line => {
      const [title, type, value, category] = line;
      registers.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      csvParsed.on('end', resolve);
    });

    const createTransaction = new CreateTransactionService();

    const transactions = await Promise.all(
      registers.map(register => {
        return createTransaction.execute({
          title: register.title,
          type: register.type,
          value: register.value,
          category: register.category,
        });
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
