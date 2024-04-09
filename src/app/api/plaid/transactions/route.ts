import { retrieveTransactions } from "@/app/lib/data";


export async function GET(request: Request) {
   const transactions = await retrieveTransactions();
   return new Response(JSON.stringify(transactions), {
        headers: {
             'Content-Type': 'application/json',
        },
     });

}