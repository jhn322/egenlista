'use client';

import * as React from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
// import { APP_NAME } from '@/lib/constants/site';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/lib/auth/validation/forgot-password';
import { AUTH_PATHS } from '@/lib/constants/routes';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/glomt-losenord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Ett fel uppstod vid återställning av lösenord.'
        );
      }

      setIsSuccess(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ett oväntat fel har uppstått.';
      console.error('Fel vid glömt lösenord:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div>
          {/* <Link href="/" className="mb-6 inline-block">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center space-x-2 rounded-lg p-1.5">
              <span className="p-2 text-xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </div>
          </Link> */}
          <h2 className="text-foreground mt-4 text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
            Glömt ditt lösenord?
          </h2>
          <p className="text-md text-muted-foreground mt-2 leading-6">
            Ange din e-post nedan för att få en återställningslänk.
          </p>
        </div>

        <div className="mt-10">
          {isSuccess ? (
            <div className="space-y-4 text-center">
              <p className="text-green-600">
                Kolla din e-post för återställningslänken!
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={AUTH_PATHS.LOGIN}>Tillbaka till inloggning</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@exempel.se"
                          type="email"
                          autoComplete="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Skickar...' : 'Skicka återställningslänk'}
                </Button>
              </form>
            </Form>
          )}

          {!isSuccess && (
            <div className="mt-6 text-center text-sm">
              <Link
                href={AUTH_PATHS.LOGIN}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Kommer du ihåg ditt lösenord? Logga in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
