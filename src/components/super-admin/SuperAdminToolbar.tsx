'use client';

import { useSession } from 'next-auth/react';
import { USER_ROLES } from '@/lib/auth/constants/auth';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShieldCheckIcon } from '@/components/icons/shield-check-icon';
import { RepeatIcon } from '@/components/icons/repeat-icon';
import { Settings2Icon } from '@/components/icons/settings2-icon';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { toggleUserSubscriptionPlan } from '@/lib/actions/superadmin.actions';

export function SuperAdminToolbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('[SuperAdminToolbar] Session status:', status);
  console.log('[SuperAdminToolbar] Session data:', session);
  if (session?.user) {
    console.log(
      '[SuperAdminToolbar] User role from session:',
      session.user.role
    );
    console.log('[SuperAdminToolbar] Expected role:', USER_ROLES.SUPER_ADMIN);
    console.log(
      '[SuperAdminToolbar] Role match:',
      session.user.role === USER_ROLES.SUPER_ADMIN
    );
  }

  if (status === 'loading') {
    return null; // Eller en liten laddningsindikator om du vill
  }

  if (session?.user?.role !== USER_ROLES.SUPER_ADMIN) {
    return null;
  }

  const handleToggleSubscription = async () => {
    setIsLoading(true);
    toast.info('Försöker växla din prenumeration...');

    try {
      // Anropar action utan targetUserId, den ska använda sessionen
      const result = await toggleUserSubscriptionPlan();
      if (result.success) {
        toast.success(result.message || 'Din prenumeration har växlats!');
      } else {
        toast.error(result.error || 'Kunde inte växla din prenumeration.');
      }
    } catch (error) {
      console.error('Fel vid växling av egen prenumeration:', error);
      toast.error('Ett oväntat fel inträffade.');
    }
    setIsLoading(false);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="fixed right-6 bottom-6 z-50">
        <div
          className={cn(
            'bg-background border-border flex items-center rounded-full border p-1.5 shadow-xl transition-all duration-300 ease-in-out',
            isOpen ? 'w-auto' : 'h-12 w-12 justify-center' // w-12 h-12 för en rundare knapp
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-muted focus-visible:ring-ring ring-offset-background rounded-full focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label={
                  isOpen
                    ? 'Stäng SuperAdmin-verktyg'
                    : 'Öppna SuperAdmin-verktyg'
                }
              >
                <ShieldCheckIcon
                  className={cn(
                    'text-primary h-6 w-6 transition-transform duration-300',
                    isOpen && 'rotate-[360deg]'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isOpen
                  ? 'Stäng SuperAdmin-verktyg'
                  : 'Öppna SuperAdmin-verktyg'}
              </p>
            </TooltipContent>
          </Tooltip>

          {isOpen && (
            <div className="flex items-center space-x-1 pr-1 pl-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSubscription}
                    disabled={isLoading}
                    className="hover:bg-muted rounded-full"
                    title="Växla din prenumeration"
                  >
                    {isLoading ? (
                      <Settings2Icon className="h-5 w-5 animate-spin" />
                    ) : (
                      <RepeatIcon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Växla din prenumeration (Free/Pro)</p>
                </TooltipContent>
              </Tooltip>
              {/* Framtida ikoner kan läggas här */}
              {/* <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" title="Annan åtgärd">
                <Settings2 className="h-5 w-5" />
              </Button> */}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
