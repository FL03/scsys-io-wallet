/**
 * Created At: 2025-04-09:14:39:41
 * @author - @FL03
 * @description - Client-side utility functions for notifications
 * @file - client.ts
 */
'use client';
// project
import { logger } from '@/lib/logger';
import { filterSearchParamsObject, resolveOrigin } from '@/lib/utils';
// feature-specific
import { NotificationData } from '../types';

type ClientHandler<TQuery = any, TOut = any> = (
  query: TQuery,
  init?: RequestInit
) => Promise<TOut>;

/**
 * Retrieve notifications for the user given their unique identifier.
 *
 * @param uid - The unique identifier of the user.
 * @param init - Optional request initialization parameters.
 * @return A promise that resolves to the user's notifications.
 */
export const fetchNotifications: ClientHandler<
  { username?: string; limit?: string; offset?: string },
  NotificationData[]
> = async (params, init) => {
  // check if params is an object and has keys
  if (typeof params !== 'object' || Object.keys(params).length === 0) {
    logger.warn(params, 'Missing search params');
  }
  // filter out nullish parameters from the params object
  const _params = filterSearchParamsObject(params);
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = new URL('/api/notifications', resolveOrigin());
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, init);
  // handle any response errors
  if (!res.ok) {
    logger.error('Failed to fetch exercise', res.statusText);
    throw new Error('Failed to fetch exercise');
  }
  // parse json
  const data = await res.json();
  // return the data or empty array
  return data ?? [];
};

export const deleteNotification = async (
  params: { id?: string },
  init: Omit<RequestInit, 'method'>
) => {
  // check if params is an object and has keys
  if (typeof params !== 'object' || Object.keys(params).length === 0) {
    logger.warn(params, 'Missing search params');
  }
  // filter out nullish parameters from the params object
  const _params = filterSearchParamsObject(params);
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = new URL('/api/notifications', resolveOrigin());
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, {
    ...init,
    method: 'DELETE',
    headers: {
      ...init.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(
      { status: res.statusText },
      'Failed to delete the notification'
    );
    throw new Error('Failed to delete the notification');
  }
  // parse json
  const data = await res.json();
  // return the data or empty array
  return data ?? null;
};
