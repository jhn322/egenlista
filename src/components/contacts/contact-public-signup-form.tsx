'use client';

// * ==========================================================================\\n// *                  PUBLIC CONTACT SIGNUP FORM COMPONENT\\n// * ==========================================================================
import React, { useTransition } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner'; // For potential future use
import { useRouter } from 'next/navigation'; // Import useRouter

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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  ContactCreateSchema,
  type ContactCreateInput,
} from '@/lib/contacts/validation/schema';
import {
  CONTACT_CONSENT_TYPES as CONSENT_DETAILS,
  AVAILABLE_CONSENT_TYPE_IDS as ALL_CONSENT_TYPES,
  TOAST_MESSAGES,
} from '@/lib/contacts/constants/contacts';
import { ConsentType } from '@/generated/prisma';
import { createContact } from '@/lib/contacts/utils/actions';

// **  Props Interface  ** //
interface ContactPublicSignupFormProps {
  userId: string; // Will be used when connecting to backend
  // Add any other props needed for the public page context if necessary
}

// **  ContactPublicSignupForm Component  ** //
export function ContactPublicSignupForm({
  userId,
}: ContactPublicSignupFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize router

  const form = useForm<ContactCreateInput>({
    resolver: zodResolver(ContactCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressStreet: '',
      addressStreet2: '',
      addressPostalCode: '',
      addressCity: '',
      addressCountry: '',
      consents: ALL_CONSENT_TYPES.map((type) => ({
        consentType: type,
        granted: false,
      })),
    },
  });

  const { fields: consentFields } = useFieldArray({
    control: form.control,
    name: 'consents',
  });

  const onSubmit = (values: ContactCreateInput) => {
    startTransition(async () => {
      try {
        // Call the server action - no need to store result if not used
        await createContact(values, userId);

        // Redirect to thank you page
        router.push(`/signup/${userId}/tack`);
      } catch (error) {
        let errorMessage = TOAST_MESSAGES.UNKNOWN_ERROR_DESC;
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(TOAST_MESSAGES.CREATE_ERROR_TITLE, {
          description: errorMessage,
        });
        console.error('Error creating contact:', error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* Personal Information and Address Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="border-border space-y-6 rounded-lg border p-6 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-card-foreground text-lg leading-6 font-medium">
                Personuppgifter
              </h3>
              <p className="text-muted-foreground text-sm">
                Fyll i dina personuppgifter så att vi kan kontakta dig.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Förnamn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange förnamn"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efternamn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange efternamn"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ange e-postadress"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (valfri)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange telefonnummer"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-border space-y-6 rounded-lg border p-6 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-card-foreground text-lg leading-6 font-medium">
                Adress{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  (Valfritt)
                </span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Fyll i din adress om du vill att vi ska kunna nå dig via post.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="addressStreet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gatuadress</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange gatuadress"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressStreet2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adressrad 2 (valfri)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange extra adressrad"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="addressPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postnummer</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ange postnummer"
                          {...field}
                          disabled={isPending}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ort</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ange ort"
                          {...field}
                          disabled={isPending}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="addressCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ange land"
                        {...field}
                        disabled={isPending}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Consents Section - Integrated */}
        <div className="border-border space-y-6 rounded-lg border p-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-card-foreground text-lg leading-6 font-medium">
              Samtycken
            </h3>
            <p className="text-muted-foreground text-sm">
              För att kunna hantera dina uppgifter behöver vi ditt samtycke.
            </p>
          </div>

          <div className="space-y-4">
            {consentFields.map((field, index) => {
              const consentInfo = CONSENT_DETAILS[field.consentType];
              const isStorage = field.consentType === ConsentType.STORAGE;

              return (
                <Controller
                  key={field.id}
                  control={form.control}
                  name={`consents.${index}.granted`}
                  render={({ field: checkboxField, fieldState: { error } }) => (
                    <FormItem
                      className={cn(
                        'bg-background flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 transition-colors',
                        isStorage ? 'border-primary/30' : 'border-border',
                        error
                          ? 'border-destructive ring-destructive ring-1'
                          : 'hover:border-muted-foreground/50'
                      )}
                    >
                      <FormControl>
                        <Checkbox
                          checked={checkboxField.value}
                          onCheckedChange={checkboxField.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="flex-1 space-y-1.5 leading-none">
                        <FormLabel
                          className={cn(
                            isStorage ? 'font-semibold' : '',
                            error ? 'text-destructive' : ''
                          )}
                        >
                          {consentInfo.label}
                          {isStorage && (
                            <span className="text-destructive"> *</span>
                          )}
                        </FormLabel>
                        <FormDescription
                          className={cn(
                            'text-sm',
                            error ? 'text-destructive' : 'text-muted-foreground'
                          )}
                          dangerouslySetInnerHTML={{
                            __html: consentInfo.description,
                          }}
                        />
                        {error &&
                          error.message !==
                            'Godkännande för lagring av personuppgifter är obligatoriskt.' && (
                            <FormDescription className="text-destructive">
                              {error.message}
                            </FormDescription>
                          )}
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="h-12 w-full text-base font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Registrerar...
              </>
            ) : (
              'Registrera mig'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
