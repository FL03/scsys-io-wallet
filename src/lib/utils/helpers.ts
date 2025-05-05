/*
  Appellation: helpers <utils>
  Contrib: @FL03
*/
/** 
 * This method cleans an object, dropping any nullish entries and converting all values to strings in the process.
 * 
 * @param {Record<string, any> | { [key: string]: any }} params - The object to be cleaned.
 * @returns {URLSearchParams} - A URLSearchParams object containing the _cleaned_ search parameters.
 */
export const cleanParams = (params: Record<string, any> | { [key: string]: any }): URLSearchParams => {
  const res = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null
    ).map(([k, v]) => [k, v.toString()])
  );
  return new URLSearchParams(res);
}

export const coerceJsonInto = <TData = any, TOut = string>(values?: TData | null): TOut => {
  if (!values) return {} as TOut;
  const lex = JSON.stringify(values as any);
  return JSON.parse(lex) as TOut;
};

export const cleanupSearchParams = <TOut>(
  obj?: any | null,
): TOut => {
  // Handle nullish parameters
  if (!obj) return {} as TOut;
  // Remove undefined and null values from the object
  const filtered = Object.fromEntries(
    Object.entries(obj ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null,
    )
  );
  return filtered as TOut;
};

export const matches = <T>(arg: T, ...opts: T[]) => {
  return !!opts.find((v) => v === arg)
}

export const extractUsernameFromPathname = (pathname: string) => {
  const parts = pathname.split('/');
  const username = parts[1];
  return username;
}

export const isLoadingcomp = (props: { onAll: boolean, onSome: boolean }, ...args: boolean[]) => {
  if (args.every((l) => l)) {
    return props.onAll;
  }
  if (args.some((l) => l)) {
    return props.onSome;
  }
}

export const resolveURL = (path: string): string => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
      process?.env?.NEXT_PUBLIC_VERCEL_URL &&
        process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
        'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};
