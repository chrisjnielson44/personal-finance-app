import { withIronSessionApiRoute } from 'iron-session/next';
import { plaidClient, sessionOptions } from "@/app/lib/plaid";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
   // Ensure request.body is not null
   if (!request.body) {
      throw new Error('Request body is missing');
   }

   // Parse the request body as JSON
   const body = await request.json();

   // Now you can safely access public_token
   const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: body.public_token,
   });

   return NextResponse.json(exchangeResponse.data);
}