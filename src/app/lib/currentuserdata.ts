import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import PlaidLink from '../dashboard/plaid-test/linkbutton';

export const prisma = new PrismaClient().$extends(withAccelerate());

export async function getUserData() {
    const session = await getServerSession(authOptions)
    const userid = parseInt(session?.user.id)
    const data = await prisma.user.findUnique(
        {
            where: { id: userid },
            cacheStrategy: { ttl: 60 },
        }
    );
    return data;
}

