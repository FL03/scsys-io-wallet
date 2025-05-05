/**
 * Created At: 2025-04-13:19:23:24
 * @author - @FL03
 * @file - form.ts
 */
'use server';
// imports
import { AuthResponse } from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
import { createUrl } from '@/lib/utils';

export const handleRegistrationAction = async (
  formData: FormData
): Promise<AuthResponse['data']> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const captchaToken = formData.get('captchaToken')
    ? (formData.get('captchaToken') as string)
    : undefined;
  // initialize a server-side supabase client
  const supabase = await createServerClient();
  // sign up the user with email and password
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: createUrl('/auth/callback').toString(),
      captchaToken,
    },
  });

  if (error) {
    logger.error(error, 'Registration failed. Please try again.');
    throw new Error(error.message);
  }
  logger.info(
    'Registration successful! Check your email for a confirmation link.'
  );
  return data;
};

export const handleEmailPasswordAction = async (
  formData: FormData
): Promise<AuthResponse['data']> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const captchaToken = formData.get('captchaToken')
    ? (formData.get('captchaToken') as string)
    : undefined;
  // initialize a server-side supabase client
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

  if (error) {
    logger.error(error, 'Login failed. Please try again.');
    throw new Error(error.message);
  }
  logger.info('Successfully authenticated the user!');
  return data;
};

export const handlePasswordlessLoginAction = async (
  formData: FormData
): Promise<AuthResponse['data']> => {
  const email = formData.get('email') as string;

  const captchaToken = formData.get('captchaToken')
    ? (formData.get('captchaToken') as string)
    : undefined;
  // initialize a server-side supabase client
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      captchaToken,
    },
  });

  if (error) {
    logger.error(error, 'Login failed. Please try again.');
    throw new Error(error.message);
  }
  logger.info('Passwordless login email sent successfully!');
  return data;
};
