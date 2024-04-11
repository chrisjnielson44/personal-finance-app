import { plaidClient } from '@/app/lib/plaid';
import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { redirect } from 'next/navigation';



export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/')

    return new NextResponse(JSON.stringify({ error: 'No session found' }), { status: 400 });

  }
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID || 'default_client_id' },
    client_name: "Paywind Personal Finance",
    language: 'en',
    products: [Products.Auth, Products.Transactions, Products.Investments],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });
  console.log((NextResponse.json(tokenResponse.data)))

  return NextResponse.json(tokenResponse.data);
}

