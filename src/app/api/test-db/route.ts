import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { getServerSession } from "next-auth/next"


const prisma = new PrismaClient().$extends(withAccelerate())


export async function GET(request: Request) {

  const person = prisma.test_table.findMany(
    {
      cacheStrategy: { ttl: 60 },
    }
  );
  return NextResponse.json(person);
}

export async function POST(request: Request) {
  const body = await request.json();
  const test = await prisma.test_table.create({
    data: {
      name: body.name,
      age: body.age,
    },
  });
  return NextResponse.json(test);
}

