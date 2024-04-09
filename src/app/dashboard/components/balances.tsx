import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUserData, postBalances, retrieveBalances } from "@/app/lib/data";
import { LandmarkIcon } from "lucide-react";



function toSentenceCase(str: string) {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default async function Balances() {
    // Fetch the user data
    const user = await getUserData();
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.access_token) {
        return [];
    }
    // Post the balances to the database
    postBalances();
    // Retrieve the balances from the database
    const balances = await retrieveBalances();
    if (!balances) {
        return null;
    }


    return (balances || []).map((account) => (
        <Card key={account.name} className="col-span-1 mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm md:text-xl font-medium">
                    {toSentenceCase(account.officialName ?? '')}
                </CardTitle>
                <LandmarkIcon className="h-4 w-4 fill-currentColor" />
            </CardHeader>
            <CardDescription className="flex items-center justify-between pl-6">
                {account.name}
            </CardDescription>
            <CardContent className="justify-center pt-5">
                <div className="flex items-center">
                    <p className="text-2xl md:text-3xl font-bold text-primary">${account.currentBalance ?? 'N/A'}</p>
                </div>
            </CardContent>
        </Card>
    ));
}