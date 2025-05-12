'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { resetPasswordSchema } from '@/lib/auth/validation/reset-password';
import { AUTH_PATHS } from '@/lib/constants/routes';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  });

  React.useEffect(() => {
    if (!token) {
      setError('Ogiltigt eller saknat återställningstoken.');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Ogiltigt eller saknat återställningstoken.');
      toast.error('Ogiltigt eller saknat återställningstoken.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/aterstall-losenord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, token }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Kunde inte återställa lösenordet.'
        );
      }

      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ett oväntat fel har inträffat.';
      console.error('Fel vid lösenordsåterställning:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  function renderContent() {
    if (error && !isSuccess) {
      return (
        <div className="space-y-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href={AUTH_PATHS.FORGOT_PASSWORD}>
              Begär ny återställningslänk
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href={AUTH_PATHS.LOGIN}>Tillbaka till inloggning</Link>
          </Button>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="space-y-4 text-center">
          <p className="text-green-600">Ditt lösenord har återställts!</p>
          <Button asChild className="w-full">
            <Link href={AUTH_PATHS.LOGIN}>Gå till inloggning</Link>
          </Button>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nytt lösenord</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bekräfta nytt lösenord</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !token}
          >
            {isLoading ? 'Återställer...' : 'Återställ lösenord'}
          </Button>
        </form>
      </Form>
    );
  }

  return <div className="mt-10">{renderContent()}</div>;
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div>
          {/* <Link href="/" className="mb-6 inline-block">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center space-x-2 rounded-xl p-1.5">
              <span className="p-2 text-xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </div>
          </Link> */}
          <h2 className="text-foreground mt-4 text-2xl leading-9 font-bold tracking-tight sm:text-3xl">
            Återställ ditt lösenord
          </h2>
          <p className="text-md text-muted-foreground mt-2 leading-6">
            Ange ditt nya lösenord nedan.
          </p>
        </div>

        <React.Suspense fallback={<div className="mt-10">Laddar...</div>}>
          <ResetPasswordForm />
        </React.Suspense>
      </div>
    </div>
  );
}
