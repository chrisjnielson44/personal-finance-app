import { plaidClient } from '@/app/lib/plaid';
import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';


export async function POST(request: Request) {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: process.env.PLAID_CLIENT_ID || 'default_client_id' },
    client_name: "Paywind Personal Finance",
    language: 'en',
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });

  return NextResponse.json(tokenResponse.data);
}
