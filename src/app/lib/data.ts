import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { plaidClient } from './plaid';
import { prisma } from './prisma';


export async function getUserData() {
    const session = await getServerSession(authOptions)
    const userid = parseInt(session?.user.id)
    const data = await prisma.user.findUnique(
        {
            where: { id: userid },
            cacheStrategy: { ttl: 120 },
        }
    );
    return data;
}

// Post user balances to the database via Plaid Client
export async function postBalances() {
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.access_token) {
        throw new Error('No access token found');
    }

    // 1 min cool down
    const COOLDOWN_PERIOD = 60 * 1000; // 1 min in milliseconds
    const now = new Date();
    const lastUpdate = new Date(user.lastBalanceUpdate || 0);
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

    if (timeSinceLastUpdate < COOLDOWN_PERIOD) {
        // Exit if we're within the cooldown period
        console.log('Cooldown period has not elapsed, skipping balance update.');
        return;
    }

    const balanceResponse = await plaidClient.accountsBalanceGet({
        access_token: user.access_token,
    });

    console.log(balanceResponse.data.accounts);

    const balances = balanceResponse.data.accounts.map((account) => ({
        userId: user.id,
        accountId: account.account_id,
        currentBalance: account.balances.current ?? 0,
        availableBalance: account.balances.available,
        mask: account.mask,
        name: account.name,
        officialName: account.official_name,
        persistentAccountId: account.persistent_account_id,
        subtype: account.subtype ?? '',
        type: account.type,
    }));
    const uploadBalances = await prisma.accountBalance.createMany({
        data: balances,
    });
    await prisma.user.update({
        where: { id: user.id },
        data: { lastBalanceUpdate: now },
    });

    return uploadBalances;
}

// retrieve user balances from the database
export async function retrieveBalances() {
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.access_token) {
        return [];
    }

    // Fetch all balance records from the database for the user
    const balances = await prisma.accountBalance.findMany({
        where: { userId: user.id },
    });

    if (!balances.length) {
        return null; // or return an empty array, depending on your preference
    }

    return balances;
}

export async function postTransactions() {
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.access_token) {
        throw new Error('No access token found');
    }

    // Define a cooldown period, e.g., 24 hours
    const COOLDOWN_PERIOD = 60 * 1000; // 1 min in milliseconds
    const now = new Date();
    const lastUpdate = new Date(user.lastTransactionUpdate || 0);
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

    if (timeSinceLastUpdate < COOLDOWN_PERIOD) {
        // Exit if we're within the cooldown period
        console.log('Cooldown period has not elapsed, skipping transaction update.');
        return;
    }
    // get cuurent day
    const date = new Date();

    const transactionsResponse = await plaidClient.transactionsGet({
        access_token: user.access_token,
        start_date: '2021-01-01',
        end_date: date.toISOString().split('T')[0],
    });

    const transactionData = transactionsResponse.data.transactions.map((transaction) => ({
        userId: user.id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        isoCurrencyCode: transaction.iso_currency_code ?? '',
        unofficialCurrencyCode: transaction.unofficial_currency_code ?? '',
        category: transaction.category ?? [],
        category_id: transaction.category_id ?? '',
        date: transaction.date,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        transactionId: transaction.transaction_id,
        transactionType: transaction.transaction_type ?? '',
    }));

    const uploadTransactions = await prisma.transaction.createMany({
        data: transactionData,
        skipDuplicates: true,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: { lastTransactionUpdate: now },
    });

    return uploadTransactions;
}

export async function retrieveTransactions() {
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found');
    }
    const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        cacheStrategy: { ttl: 120 },
    });
    return transactions;
}