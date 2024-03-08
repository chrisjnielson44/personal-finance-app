"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SignIn({ className, ...props }: UserAuthFormProps) {
    // const [isLoading, setIsLoading] = React.useState<boolean>(false)

    // async function onSubmit(event: React.SyntheticEvent) {
    //     event.preventDefault()
    //     setIsLoading(true)

    //     setTimeout(() => {
    //         setIsLoading(false)
    //     }, 3000)
    // }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Input
                            id="email"
                            placeholder="Email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            className="my-2"
                        />
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            autoComplete="current-password"
                            autoCorrect="off"
                            className="my-2"
                        />
                    </div>
                    <Button className="mt-2 text-white">
                        Sign In
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className=" px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant={"default"} type="button" className="bg-blue-500 text-white dark:bg-white dark:text-black hover:bg-blue-900 dark:hover:bg-neutral-200">
                Google
            </Button>
        </div>
    )
}
