'use client'
import { FormEvent } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useFormState } from "react-dom";
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export default async function SignIn() {

    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            SignInSchema.parse({ email, password });
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    toast.error(err.message);
                });
                return;
            }
            throw error;
        }

        const response = await signIn('credentials', {
            email,
            password,
            redirect: false
        });

        if (!response?.error) {
            router.push('/dashboard');
            router.refresh();
        } else {
            toast.error('Incorrect Username or Password');
        }
    };

    return (
        <div>
            <div><Toaster /></div>
            <div className="flex  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email" className="block text-sm font-bold leading-6 dark:text-white text-green-500">
                                Email Address
                            </Label>
                            <div className="mt-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="block text-sm font-bold leading-6 dark:text-white text-green-500">
                                    Password
                                </Label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-black dark:text-white hover:text-red-600">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}