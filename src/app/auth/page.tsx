import SignUp from "./auth";
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

export default async function Auth() {
  const session = await getServerSession(authOptions)

    return (
        <div>
           <SignUp />
            <pre>{JSON.stringify(session)}</pre>

        </div>
    );
}