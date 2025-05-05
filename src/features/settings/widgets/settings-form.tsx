/*
  Appellation: settings_form <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// project
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// feature-specific
import * as actions from '../utils';

const settingsForm = z.object({
  theme: z.string().default('system').nullish(),
});

export type SettingsFormData = z.infer<typeof settingsForm>;

export const SettingsForm: React.FC<React.ComponentProps<"form"> & { defaultValues?: any; values?: any; }> = ({
  className,
  defaultValues,
  values,
  ...props
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!mounted);
  const { theme, setTheme } = useTheme();
  // 1. Define the form
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsForm),
    defaultValues,
    values: values,
  });

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    if (isLoading && !mounted) {
      setMounted(true);
      setIsLoading(false);
    }
  }, [mounted, setMounted]);

  if (!mounted) return null;

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // prevent the default form submission
    event.preventDefault();
    try {
      const values = form.getValues();
      await actions.handleSubmitSettings(values);
      toast.success('Settings saved successfully');
    } catch(err) {
      toast.error('An error occurred while saving your settings');
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('w-full flex flex-col gap-2 lg:gap-4', className)}
        onSubmit={handleOnSubmit}
        {...props}
      >
        <FormField
          control={form.control}
          name="theme"
          render={({ ...field }) => (
            <FormItem>
              <FormLabel>Theme Mode</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => setTheme(value)}
                  value={theme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your preffered theme" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the theme mode you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="flex flex-nowrap gap-2 lg:gap-4 items-center ">
          <Button type="submit">Save</Button>
        </section>
      </form>
    </Form>
  );
};

export default SettingsForm;
