import { plaidClient } from "@/app/lib/plaid";
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/currentuserdata';
import { getUserData } from '@/app/lib/currentuserdata';

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

   const user = await getUserData();

   if (!user) {
      throw new Error('User not found');
   }

   const uploadAccessToken = await prisma.user.update({
      where: { id: user.id },
      data: { plaidExchangeToken: exchangeResponse.data.access_token },
   });

   return NextResponse.json(uploadAccessToken, { status: 200 });
}

