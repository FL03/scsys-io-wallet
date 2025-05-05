/*
  Appellation: server <auth-helpers>
  Contrib: @FL03
*/
'use server';
// imports
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// project
import { logger } from '@/lib/logger';
// feature-specific
import { createServerClient } from '@/lib/supabase/server';
import { getURL, getErrorRedirect, getStatusRedirect } from '../database';
import { getAuthTypes } from './settings';

const authPrefix = '/auth';

const urls = {
  callback: '/auth/callback',
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  updatePassword: '/auth/update-password',
}

const authPath = (path: string | string[]) => {
  if (!Array.isArray(path)) {
    path = [path];
  }
  return [authPrefix, ...path].join('/');
};

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    );
  }

  return authPath('login');
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = await cookies();
  const callbackURL = getURL(urls.callback);

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      urls.login,
      'Invalid email address.',
      'Please try again.'
    );
  }

  const supabase = await createServerClient();
  const options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      urls.login,
      'You could not be signed in.',
      error.message
    );
  } else if (data) {
    await cookieStore.set('preferredSignInView', 'email', { path: '/' });
    redirectPath = getStatusRedirect(
      urls.login,
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      urls.login,
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      urls.forgotPassword,
      'Invalid email address.',
      'Please try again.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      urls.forgotPassword,
      error.message,
      'Please try again.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      urls.forgotPassword,
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      urls.forgotPassword,
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = await cookies();
  let redirectPath: string;
  // initialize the supabase client for server-side operations
  const supabase = await createServerClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email')).trim(),
    password: String(formData.get('password')).trim(),
  });

  if (error) {
    logger.error('Error signing in user', error);
    redirectPath = getErrorRedirect(
      urls.login,
      'Sign in failed.',
      error.message
    );
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect(
      urls.login,
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL(urls.callback);

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();

  if (!isValidEmail(email)) {
    logger.error('Invalid email address', email);
    return getErrorRedirect(
      urls.register,
      'Invalid email address.',
      'Please try again.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createServerClient();

  // Sign up the user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
    },
  });

  if (signUpError) {
    logger.error('Error signing up user', signUpError);
    return getErrorRedirect(
      urls.register,
      'Sign up failed.',
      signUpError.message
    );
  }

  if (!data.user) {
    logger.error('User not found after sign up', data.user);
    throw Error('User not found after sign up');
  }

  const { user } = data;
  const { error: insertError } = await supabase.from('profiles').insert([
    {
      email: [email],
      avatar: user?.user_metadata.avatar,
      username: user?.user_metadata.username,
      id: user.id,
    },
  ]);
  if (insertError) {
    logger.error('Error inserting user profile', insertError);
    return getErrorRedirect(
      urls.register,
      'Sign up failed.',
      insertError.message
    );
  }

  return getStatusRedirect(
    urls.login,
    'Success!',
    'Please check your email for a confirmation link.',
    true
  );
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      urls.updatePassword,
      'Your password could not be updated.',
      'Passwords do not match.'
    );
  }
  // initialize the supabase client for server-side operations
  const supabase = await createServerClient();
  // Update the user's password
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      urls.updatePassword,
      'Your password could not be updated.',
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Your password has been updated.'
    );
  } else {
    redirectPath = getErrorRedirect(
      urls.updatePassword,
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/profile',
      'Your email could not be updated.',
      'Invalid email address.'
    );
  }

  const supabase = await createServerClient();

  const callbackUrl = getURL(
    getStatusRedirect('/profile', 'Success!', `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl,
    }
  );

  if (error) {
    return getErrorRedirect(
      '/profile',
      'Your email could not be updated.',
      error.message
    );
  } else {
    return getStatusRedirect(
      '/profile',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = await createServerClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return getErrorRedirect(
      '/profile',
      'Your name could not be updated.',
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/profile',
      'Success!',
      'Your name has been updated.'
    );
  } else {
    return getErrorRedirect(
      '/profile',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    );
  }
}
