import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { signOut } from "next-auth/react";



// Using dialog lets make a confirmation dialog to delete the user
export default async function DeleteUser() {
    // Get the router
    const router = useRouter();
    // delete user by fetching the delete user route
    const deleteUser = async () => {
        const response = await fetch("/api/auth/delete-user", {
            method: "DELETE",
        });
        if (response.ok) {
            // Redirect to the login page
            signOut();

        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button variant={"destructive"}>Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogDescription>
                        <p>Are you sure you want to delete your account? This action is <b>irreversible</b>.</p>
                    </DialogDescription>
                    {/* <Label>Password</Label>
                    <Input type="password" /> */}
                    <Button type="submit" variant="destructive" onClick={deleteUser}>
                        Delete Account
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogContent>
    
            </Dialog>
        </div>
    )
}


