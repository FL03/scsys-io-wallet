/**
 * Created At: 2025-04-08:08:35:33
 * @author - @FL03
 * @description - description
 * @file - urls.ts
 */
// project
import { logger } from '@/lib/logger';

export const buildEndpoint = (...path: string[]): string => {
  return path.join('/');
};

export const resolveOrigin = () => {
  let origin: string;
  if (typeof window === 'undefined') {
    const tmp =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    if (tmp && tmp.trim() !== '') {
      origin = tmp;
    }
    origin = 'http://localhost:3000';
  } else {
    origin = window.location.origin;
  }
  return origin;
};

export const createUrl = (
  path: string,
  searchParams?: string[][] | Record<string, string> | URLSearchParams
) => {
  let urlObj = new URL(path, resolveOrigin());
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    urlObj.search = params.toString();
  }
  return urlObj;
};

/** filter out nullish parameters from some object */
export const filterSearchParamsObject = (
  params: { [key: string]: string | null | undefined }
): Record<string, string> => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== 'null' &&
        value !== 'undefined' &&
        value.trim() !== ''
    )
  );
  return filtered as Record<string, string>;
};

export const handleSearchParams = (
  params: Record<string, string | null | undefined> | { [key: string]: any }
): Record<string, string> => {
  // check if params is an object and has keys
  if (typeof params !== 'object' || Object.keys(params).length === 0) {
    logger.warn({ params }, 'No search params provided');
    return {};
  }
  // ensure undefined or null params are not passed to the URL
  const _params = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
  return _params;
};
