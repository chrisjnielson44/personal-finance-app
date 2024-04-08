'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function PlaidLink() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('/api/plaid/link/token/create', {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    createLinkToken();

  }, []);
  const onSuccess = useCallback(async (publicToken: any) => {

    // First, exchange the public token for an access token
    await fetch('/api/plaid/link/token/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    // Redirect to dashboard after success
    router.push('/dashboard');
  }, [router]);

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <div>
      <Button onClick={() => open()} disabled={!ready} className='text-white'>
        Link Account
      </Button>
    </div>

  );
}

