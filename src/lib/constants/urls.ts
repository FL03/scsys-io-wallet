// urls.tsx
export const ENDPOINT_AUTH = '/auth';
export const ENDPOINT_AUTH_LOGIN = '/auth/login';

export const EDNPOINT_ADMIN = '/admin';
export const ENDPOINT_PROFILE = '/profile';


export const buildEndpoint = (base: string, ...path: string[]) => {
  return `${base}${path.length ? `/${path.join('/')}` : ''}`;
}

export const authEndpoint = (...path: string[]) => {
  return buildEndpoint(ENDPOINT_AUTH, ...path);
}

export const profileEndpoint = (...path: string[]) => {
  return buildEndpoint(ENDPOINT_AUTH_LOGIN, ...path);
}