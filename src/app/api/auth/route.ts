import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request: Request) {
    const body = await request.json();
    const { firstName, lastName, emailAddress, password } = body;
   
    // Validate the input (e.g., check if email is already in use)
    const existingUser = await prisma.user.findUnique({
       where: { email: emailAddress },
    });
   
    if (existingUser) {
       return new NextResponse(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
    }
   
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    // Create the user in the database
    const user = await prisma.user.create({
       data: {
         firstName,
         lastName,
         email: emailAddress,
         password: hashedPassword,
         plaidExchangeToken: 'default_value_or_null', // Add this line
       },
    });
   
    return new NextResponse(JSON.stringify({ message: 'User created successfully', user }), { status: 200 });
   }