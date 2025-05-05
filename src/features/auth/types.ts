/*
  Appellation: types <auth>
  Contrib: @FL03
*/

export type RegistrationView = 'register' | 'registration';
export type LoginView = 'login' | 'email-password' | 'sign-in';
export type PasswordlessView = 'magic' | 'passkey';
export type ResetPasswordView = 'reset-password' | 'forgot-password';

export type AuthView = RegistrationView | LoginView | PasswordlessView | ResetPasswordView;

export enum AuthGateState {
  Login = 'login',
  Register = 'register',
  ForgotPassword = 'forgot-password',
  ResetPassword = 'reset-password',
  Confirm = 'confirm',
  
}