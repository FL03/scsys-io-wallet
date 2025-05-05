/**
 * Created At: 2025-04-04:18:05:28
 * @author - @FL03
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import {
  handleEmailPasswordLogin,
  verifyTurnstileToken,
} from '@/features/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, turnstileToken } = body;

    // Get client IP from Next.js request
    const remoteIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // use the method
    const isValid = await verifyTurnstileToken({
      remoteIp,
      token: turnstileToken,
    });
    // check if the response is valid
    if (!isValid) {
      logger.error('Turnstile token validation failed');
      throw new Error('Turnstile token validation failed');
    }
    logger.info(
      'Turnstile token validated successfully; authenticating user...'
    );
    const data = await handleEmailPasswordLogin({
      email,
      password,
      options: {
        captchaToken: turnstileToken,
      },
    });
    logger.info({ data }, 'User authenticated successfully');
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    logger.error(error, 'Authentication failed; please try again...');
    return NextResponse.error();
  }
}
