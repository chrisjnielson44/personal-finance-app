import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { postTransactions, retrieveTransactions, getUserData } from "@/app/lib/data"


export async function PlaidTransactions() {
  const user = await getUserData();
  if (!user) {
    throw new Error('User not found');
  }
  if (!user.access_token) {
    return [];
    throw new Error('No access token found');
  }
  postTransactions();
  const transactions = await retrieveTransactions();

  const transactionsData = transactions.map((transaction) => ({
    name: transaction.name,
    method: transaction.transactionType,
    category: transaction.category,
    amount: transaction.amount,
    channel: transaction.paymentChannel,
  }));

  const last5Transactions = transactionsData.slice(0, 5);


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs">
        {last5Transactions.map((transaction) => (
          <TableRow key={transaction.name}>
            <TableCell>{transaction.name}</TableCell>
            <TableCell>{transaction.channel}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell className="text-right">${transaction.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  )
}
