'use client';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { resolveOrigin } from '@/lib/utils';
// feature-specific
import { EmailPasswordSchema } from '../widgets/forms';

export const validateTurnstileToken = async (token: string) => {
  const url = new URL('/auth/captcha', resolveOrigin());
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      turnstileToken: token,
    }),
  });
  const data = await res.json();
  if (!data.success) {
    logger.error({ data }, 'Error validating Turnstile token');
    return false;
  }
  return true;
};

export const handleEmailPasswordLoginWithTurnstile = async ({
  formData,
  turnstileToken,
}: {
  formData: EmailPasswordSchema;
  turnstileToken: string;
}): Promise<AuthTokenResponsePassword['data']> => {
  const url = new URL('/auth/captcha', resolveOrigin());
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      turnstileToken,
    }),
  });
  const data = await res.json();
  if (!data.success) {
    logger.error({ data }, 'Error validating Turnstile token');
  }
  return data;
};
