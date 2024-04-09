import { plaidClient } from "@/app/lib/plaid";
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/data';
import { getUserData } from '@/app/lib/data';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return new NextResponse(JSON.stringify({ error: 'No session found' }), { status: 400 });
   }
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
      data: {
         access_token: exchangeResponse.data.access_token,
         item_id: exchangeResponse.data.item_id,
         request_id: exchangeResponse.data.request_id
      },
   });

   return NextResponse.json(uploadAccessToken, { status: 200 });
}

