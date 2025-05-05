/*
  Appellation: passwordless_login <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Slot } from '@radix-ui/react-slot';
import { SignInWithPasswordlessCredentials } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { Loader2Icon, LogInIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const passwordlessSchema = z.object({
  email: z
    .string({ required_error: 'A valid email address is required to login' })
    .email({
      message: 'Invalid email address.',
    })
    .refine((arg) => arg.trim().length > 0),
});

type PasswordlessSchema = z.infer<typeof passwordlessSchema>;

export const PasswordlessLoginForm: React.FC<
  Omit<React.ComponentPropsWithRef<'form'>, 'onSubmit'> & {
    defaultValues?: Partial<PasswordlessSchema>;
    values?: PasswordlessSchema;
    captchaToken?: string;
    options?: SignInWithPasswordlessCredentials['options'];
    asChild?: boolean;

    beforeSubmit?: () => void;
    onCancel?: () => void;
    onSubmitSuccess?: (data: PasswordlessSchema) => void;
  }
> = ({
  ref,
  captchaToken,
  className,
  defaultValues,
  values,
  options,
  asChild,
  beforeSubmit,
  onCancel,
  onSubmitSuccess,
  ...props
}) => {
  if (defaultValues && values) {
    logger.warn(
      'Both defaultValues and values are provided. Merging into defaults'
    );
    defaultValues = { ...defaultValues, ...values };
    values = undefined;
  }
  if (!defaultValues && !values) {
    defaultValues ??= {
      email: '',
    };
  }
  // initialize the form state
  const supabase = createBrowserClient();
  // define the form using the hook
  const form = useForm<PasswordlessSchema>({
    resolver: zodResolver(passwordlessSchema),
    defaultValues,
    values,
  });
  // handle form submissions
  const handleOnSubmit = (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // handle the form submission
    logger.trace('Submitting the passwordless login form...');
    return form.handleSubmit(async (formData) => {
      if (beforeSubmit) beforeSubmit();
      const { data, error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: captchaToken ?? options?.captchaToken,
          ...options,
        },
      });
      // handle the error
      if (error) {
        logger.error(error, 'Error signing in with email and password...');
        // clear previous toasts
        toast.dismiss();
        // notify the user of the error
        toast.error('Error', {
          description: 'Invalid email or password. Please try again.',
        });
        // set the form error
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
        return;
      }
      // handle the success
      logger.info({ data }, 'Passwordless login email sent successfully.');
      toast.success('Success', {
        description: 'Check your email for the login link.',
      });
      // trigger the onSubmitSuccess callback
      if (onSubmitSuccess) onSubmitSuccess(formData);
    })(event);
  };

  const handleOnCancel = (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // handle the cancel action
    logger.trace('Cancelling the passwordless login form...');
    toast.dismiss(); // dismiss any open toasts
    if (onCancel) onCancel();
  };

  const Comp = asChild ? Slot : 'form';

  return (
    <Form {...form}>
      <Comp
        {...props}
        ref={ref}
        className={cn('w-full', className)}
        onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            await handleOnSubmit(event);
          }
          if (event.key === 'Escape') {
            handleOnCancel(event);
          }
        }}
        onSubmit={handleOnSubmit}
      >
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem itemType="email" datatype="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    itemType="email"
                    datatype="email"
                    type="email"
                  />
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
                <FormMessage {...field} />
              </FormItem>
            );
          }}
        />
        <div className="flex flex-row flex-nowrap gap-4 items-center justify-center">
          <Button
            type="submit"
            variant="outline"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin h-4 w-4" />
                <span className="animate-pulse">Signing in...</span>
              </>
            ) : (
              <>
                <LogInIcon className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </Button>
        </div>
      </Comp>
    </Form>
  );
};
