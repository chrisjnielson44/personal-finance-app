import { getUserData } from '@/app/lib/currentuserdata';
import { plaidClient } from '@/app/lib/plaid';

export default async function Accounts() {
    const user = await getUserData();
    if (!user) {
        return <div>Link an account first</div>;
    }
    const accounts = await plaidClient.accountsGet({
        access_token: user.plaidExchangeToken,
    });

    // display account json
    console.log(accounts.data);

    // Get account balances
    const balances = accounts.data.accounts.map((account) => {
        return {
            name: account.name,
            balance: account.balances.current,
        };
    });
     
    return (
        <div>
            <h1>Accounts</h1>
            <h2>Account Balances</h2>
            <ul>
                {balances.map((account) => (
                    <li key={account.name}>
                        {account.name}: ${account.balance}
                    </li>
                ))}
            </ul>
            <ul>
            </ul>
        </div>
    )
}