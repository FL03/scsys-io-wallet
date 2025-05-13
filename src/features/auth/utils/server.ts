/*
  Appellation: server <auth>
  Contrib: @FL03
*/
'use server';
// import
import {
  SignInWithOAuthCredentials,
  SignInWithPasswordlessCredentials,
  AuthTokenResponsePassword,
  OAuthResponse,
  AuthOtpResponse,
  Session,
  User,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
import { createUrl } from '@/lib/utils';
// feature-specific
import { RegistrationFormValues } from '../widgets/forms';

export const verifyTurnstileToken = async (props: {
  token: string;
  remoteIp: string;
}) => {
  const secretKey = process.env.CF_TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Missing CF_TURNSTILE_SECRET_KEY environment variable');
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', props.token);
  formData.append('remoteip', props.remoteIp);

  const url = new URL('/turnstile/v0/siteverify', 'https://challenges.cloudflare.com');

  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  });

  const outcome = await result.json();
  if (!outcome.success) {
    logger.error({ outcome }, 'Error validating Turnstile token');
    return false;
  }
  return true;
};

/**
 *
 */
export const handleEmailPasswordLogin = async (
  credentials: SignInWithPasswordCredentials
): Promise<AuthTokenResponsePassword['data']> => {
  // create a new supabase client
  const supabase = await createServerClient();
  // sign in with the email and password
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  // check for errors
  if (error) {
    logger.error(error, 'Authentication failed...');
    throw new Error(error.message);
  }

  return data;
};

export const handleRegistration = async (
  { email, password, passwordConfirm, username }: RegistrationFormValues,
  options?: SignUpWithPasswordCredentials['options']
): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  if (password !== passwordConfirm) {
    logger.error('Passwords do not match...');
    throw new Error('Passwords do not match...');
  }
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      ...options,
      // pass required metadata from the form
      data: {
        ...options?.data,
        username,
      },
      emailRedirectTo: createUrl('/auth/callback').toString(),
    },
  });

  // check for errors
  if (error) {
    logger.error({ error }, 'Error registering the user...');
    throw new Error(error.message);
  }

  // check for data
  if (!data.user || !data.session) {
    logger.warn('No data returned from sign up');
  }

  return data;
};

/**
 *
 * @param {SignInWithOAuthCredentials} values : the information needed for the oauth flow
 */
export const handleOAuthLogin = async (
  values: SignInWithOAuthCredentials
): Promise<OAuthResponse['data']> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth(values);
  // check for errors
  if (error) {
    logger.error({ error }, 'Error signing in with OAuth: ');
    throw new Error(error.message);
  }
  return data;
};
/**
 *
 * @param values : the information needed for the passwordless flow
 */
export const handlePasswordlessLogin = async (
  values: SignInWithPasswordlessCredentials
): Promise<AuthOtpResponse['data']> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOtp(values);

  // check for errors
  if (error) {
    logger.error({ error }, 'Error signing in with passwordless: ');
    throw new Error(error.message);
  }
  // check for data
  if (!data) {
    logger.error('No data returned from passwordless sign in');
    throw new Error('No data returned from passwordless sign in');
  }
  return data;
};

/** This method signs out the current user before redirecting them to the login page. */
export const handleLogout = async (): Promise<never> => {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut();
  // check for errors
  if (error) {
    logger.error({ error }, 'Error signing out: ');
    throw new Error(error.message);
  }
  revalidatePath('/');
  redirect('/auth/login');
};
