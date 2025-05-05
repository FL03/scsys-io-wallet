'use client';
// imports
import * as React from 'react';
import Script from 'next/script';
// project
import { logger } from '@/lib/logger';
import { LoaderIcon } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: TurnstileOptions
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  action?: string;
  callback?: (token: string) => void;
  'error-callback'?: (error: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  tabindex?: number;
  appearance?: 'always' | 'execute' | 'interaction-only';
  size?: 'normal' | 'compact';
}

type TurnstileProps = {
  action?: string;
  siteKey?: string;
  onError?: (error: string) => void;
  onExpire?: () => void;
  onSuccess?: (token: string) => void;
};

const cloudflareTurnstileSiteKey = () => {
  return (
    process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY ||
    process.env.CF_TURNSTILE_SITE_KEY ||
    process.env.CF_TURNSTILE_PUBLIC_KEY
  );
};
export const CloudflareTurnstile: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'id'> & TurnstileProps
> = ({
  ref,
  action = 'submit',
  siteKey: siteKeyProp,
  onError,
  onExpire,
  onSuccess,
  ...props
}) => {
  const [widgetId, setWidgetId] = React.useState<string | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const siteKey = siteKeyProp ?? process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    logger.error('CfTurnstil: Missing NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY');
    throw Error('Missing NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY');
  }

  const handleRender = React.useCallback(() => {
    const id = window?.turnstile?.render('#cf-turnstile', {
      sitekey: siteKey,
      action: action,
      callback: (token: string) => {
        onSuccess?.(token);
      },
      'error-callback': (error: string) => {
        onError?.(error);
      },
      'expired-callback': () => {
        onExpire?.();
      },
    });
    setWidgetId(id ?? null);
  }, [siteKey, action, setWidgetId, onSuccess, onError, onExpire]);
  // Reset the widget when the component unmounts
  React.useEffect(() => {
    if (isLoaded && window.turnstile && !widgetId) {
      handleRender();
    }
  }, [widgetId, isLoaded, setWidgetId, handleRender]);

  React.useEffect(() => {
    if (window?.turnstile) setIsLoaded(true);

    return () => {
      // Clean up the widget when component unmounts
      if (widgetId) {
        window?.turnstile?.remove(widgetId);
      }
    };
  }, [widgetId, setIsLoaded]);

  return (
    <React.Suspense fallback={<LoaderIcon className="w-4 h-4 animate-spin" />}>
      <div {...props} id="cf-turnstile" ref={ref} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={() => setIsLoaded(true)}
      />
    </React.Suspense>
  );
};

export default CloudflareTurnstile;
