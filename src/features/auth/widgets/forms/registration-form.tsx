/**
 * Created At: 2025.04.17:07:31:26
 * @author - @FL03
 * @file - registration-form.tsx
 */
'use client';
// imports
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { cn, createUrl } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// feature-specific

// 1. Define your form schema.
export const registrationFormSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email is required...',
      })
      .email(),
    password: z
      .string({
        required_error: 'Password is required...',
      })
      .min(8, {
        message: 'Password must be at least 8 characters.',
      }),
    passwordConfirm: z
      .string({ required_error: 'Password confirm is required...' })
      .min(8, {
        message: 'Password must be at least 8 characters.',
      }),
    username: z
      .string({
        required_error: 'Username is required...',
      })
      .min(3, { message: 'Username must be at least 3 characters.' })
      .max(60, { message: 'Username must be at most 60 characters.' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match.',
  });

export const parseRegistrationFormSchema = (data: unknown) => {
  try {
    return registrationFormSchema.parse(data, {
      errorMap: (issue) => {
        const { code, message } = issue;
        if (code === 'invalid_type') {
          logger.error(
            { code, message },
            'Invalid type in registration form schema...'
          );
          return {
            message: `Invalid type: ${message}`,
          };
        }
        if (code === 'custom') {
          logger.error(
            { code, message },
            'Custom error in registration form schema...'
          );
          return { message: `Custom error: ${message}` };
        }
        logger.error(
          { code, message },
          'Unknown error in registration form schema...'
        );
        return { message: `Invalid value: ${message}` };
      },
    });
  } catch (error) {
    logger.error(error, 'Failed to parse registration form schema...');
    throw error;
  }
};

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

type RegistrationFormProps = {
  defaultValues?: Partial<RegistrationFormValues>;
  values?: RegistrationFormValues;
  captchaToken?: string;
  options?: SignUpWithPasswordCredentials['options'];

  beforeSubmit?: () => void;
  onCancel?: () => void;
  onSubmitSuccess?: (values: RegistrationFormValues) => void;
};
export const RegistrationForm: React.FC<
  React.ComponentPropsWithRef<'form'> & RegistrationFormProps
> = ({
  ref,
  className,
  defaultValues,
  values,
  options,
  captchaToken,
  beforeSubmit,
  onCancel,
  onSubmitSuccess,
  ...props
}) => {
  if (defaultValues && values) {
    defaultValues = { ...defaultValues, ...values };
    values = undefined;
  }
  const supabase = createBrowserClient();
  // call the 'useForm' hook and pass your form schema to the 'resolver' property.
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues,
    values,
  });

  const handleOnSubmit = async (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // stop the event from bubbling up the parent elements
    event.stopPropagation();

    return await form.handleSubmit(async (formData) => {
      logger.trace(event, 'Submitting the registration form...');
      if (beforeSubmit) beforeSubmit();

      // register the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          ...options,
          data: {
            ...options?.data,
            email: [formData.email],
            username: formData.username,
          },
          captchaToken: captchaToken ?? options?.captchaToken ?? undefined,
          emailRedirectTo: createUrl('/auth/callback').toString(),
        },
      });
      // check for errors
      if (error) {
        // log the error
        logger.error(error, 'Error registering the user...');
        // set the form error
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
        // notify the user
        toast.error('Registration Error', {
          description: 'Registration failed; please try again.',
        });
        return;
      }
      // log the success
      logger.info(
        'Successfully registered the user: ',
        data.user?.user_metadata.username
      );
      // alert the user
      toast.success('Registration successful!', {
        description: 'Check your email to confirm your account and login!',
      });
      // reset the form
      form.reset();
      // redirect the user to the login page
      if (onSubmitSuccess) onSubmitSuccess(formData);
    })(event);
  };
  // render the registration form
  return (
    <Form {...form}>
      <form
        {...props}
        ref={ref}
        className={cn('relative w-full', className)}
        onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            await handleOnSubmit(event);
          }
          if (event.key === 'Escape') {
            if (onCancel) onCancel();
          }
        }}
        onSubmit={async (event) => {
          // handle the form submission
          await handleOnSubmit(event);
        }}
      >
        <div className="flex flex-col flex-1 gap-2 w-full">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem itemType="text" datatype="text">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    placeholder="username"
                    datatype="text"
                    itemType="text"
                    type="text"
                  />
                </FormControl>
                <FormDescription>Choose a unique username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem datatype="email" itemType="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    placeholder="example@example.com"
                    datatype="email"
                    itemType="email"
                    type="email"
                  />
                </FormControl>
                <FormDescription>
                  The email address associated with your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem datatype="password" itemType="password">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    placeholder="password"
                    type="password"
                  />
                </FormControl>
                <FormDescription>Your account password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem datatype="password" itemType="password">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
                </FormControl>
                <FormDescription>Confirm your account password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <section className="bottom-0 mt-4 w-full flex flex-col gap-2">
          <div className="flex flex-1 w-full justify-center gap-2">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              variant="secondary"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin h-4 w-4" />
                  <span className="animate-pulse">Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </Button>
          </div>
          <div className="flex flex-row flex-nowrap gap-2 text-sm w-full">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hover:underline"
            >
              <Link href="/auth/login">Already have an account?</Link>
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};
RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;
