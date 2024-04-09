import { retrieveBalances } from "@/app/lib/data";

export async function GET(request: Request) {
    const balances = await retrieveBalances();
    return new Response(JSON.stringify(balances), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

