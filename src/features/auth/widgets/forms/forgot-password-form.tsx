/**
 * Created At: 2025-04-02:20:54:00
 * @author - @FL03
 * @description - forgot password form
 * @file - forgot-password-form.tsx
 */
'use client';
// imports
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
import { cn } from '@/lib/utils';
// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Please provide the email associated with the account',
    })
    .email()
    .default(''),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// Forgot Credentials Form
export const ForgotPasswordForm: React.FC<
  React.ComponentProps<'form'> & {
    defaultValues?: Partial<ForgotPasswordSchema>;
    values?: ForgotPasswordSchema;
    captchaToken?: string;
    asChild?: boolean;
    onCancel?: () => void;

    beforeSubmit?: () => void;
    onSubmitSuccess?: (data: ForgotPasswordSchema) => void;
  }
> = ({ className, defaultValues, values, captchaToken, ...props }) => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    defaultValues,
    values,
  });

  return (
    <Form {...form}>
      <form className={cn('', className)}>
        <FormField
          name="email"
          render={({ ...field }) => {
            return (
              <FormItem itemType="email" datatype="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="input"
                    datatype="email"
                    itemType="email"
                    type="email"
                    placeholder="Email"
                  />
                  <FormMessage>
                    {form.formState.errors.email?.message?.toString()}
                  </FormMessage>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};
ForgotPasswordForm.displayName = 'ForgotCredentialsForm';
