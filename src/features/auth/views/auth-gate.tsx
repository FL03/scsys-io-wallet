/*
  Appellation: auth_gate <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
// project
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
// feature-specific
import {
  EmailPasswordForm,
  PasswordlessLoginForm,
  RegistrationForm,
} from '../widgets';
import { AuthView } from '../types';
// components
import { CloudflareTurnstile } from '@/components/common/turnstile';
import { Separator } from '@/components/ui/separator';

const authGateVariants = cva('', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'default',
      centered: '',
    },
  },
});

type AuthGateProps = {
  view?: string | AuthView;
  asChild?: boolean;
  centered?: boolean;
  withCaptcha?: boolean;
} & VariantProps<typeof authGateVariants>;

/**
 * AuthGate component
 * @description - The AuthGate component is a wrapper for the authentication forms. It provides a layout for the forms and handles the logic for displaying the correct form based on the view prop.
 */
export const AuthGate: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & AuthGateProps
> = ({
  ref,
  className,
  view = 'login',
  asChild,
  centered,
  withCaptcha,
  ...props
}) => {
  // get a reference to the isMobile hook
  const isMobile = useIsMobile();
  const router = useRouter();
  // declare a captcha state
  const [captcha, setCaptcha] = React.useState<string | undefined>(undefined);

  // use the useParams hook to get the view
  const isRegister =
    ['signup', 'sign-up'].includes(view) || view.startsWith('regist');
  const isPasswordless = ['magic', 'passkey', 'passwordless'].includes(view);
  const isEmailPassword = [
    'login',
    'email-password',
    'sign-in',
    'signin',
  ].includes(view);


  const headerMap = {
    login: {
      description: 'Sign in to your account',
      title: 'Login',
    },
    register: {
      description: 'Create an account to get started.',
      title: 'Register',
    },
    passwordless: {
      description: 'Sign in with a magic link sent to your email.',
      title: 'Passwordless Login',
    },
  };

  const resolveDescription = () => {
    if (isRegister) return headerMap.register.description;
    else if (isPasswordless) return headerMap.passwordless.description;
    else return headerMap.login.description;
  };

  const resolveTitle = () => {
    if (isRegister) return headerMap.register.title;
    else if (isPasswordless) return headerMap.passwordless.title;
    else return headerMap.login.title;
  };




  const isCentered = centered ?? isMobile;

  const renderForm = () => {
    if (isRegister) {
      return (
        <RegistrationForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/')}
        />
      );
    }
    if (isPasswordless) {
      return (
        <PasswordlessLoginForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/')}
        />
      );
    }
    if (isEmailPassword) {
      return (
        <EmailPasswordForm
          captchaToken={captcha}
          onSubmitSuccess={() => router.push('/')}
        />
      );
    }
  };
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-1 max-w-sm w-full h-full',
        isCentered &&
          'items-center justify-center justify-items-center mx-auto container',
        !isCentered && 'ml-auto',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col w-full px-4 py-2 gap-2',
          'bg-card border-card/75 rounded-xl shadow-inner drop-shadow-card drop-shadow-sm',
          !isCentered && 'border-l rounded-none flex-1 h-full',
          isCentered && 'border m-auto'
        )}
      >
        <div className="relative flex flex-col w-full">
          <section className="flex flex-col left-0 mb-2 w-full">
            <div className="font-semibold text-xl tracking-tight">{resolveTitle()}</div>
            <span className="text-muted-foreground text-sm">{resolveDescription()}</span>
          </section>
          {renderForm()}
          <Separator className="my-2" />
          <div className="mx-auto bottom-0">
            <CloudflareTurnstile
              onSuccess={setCaptcha}
              onError={() => setCaptcha(undefined)}
              onExpire={() => setCaptcha(undefined)}
            />
          </div>
        </div>
      </div>
    </Comp>
  );
};
AuthGate.displayName = 'AuthGate';

export default AuthGate;
