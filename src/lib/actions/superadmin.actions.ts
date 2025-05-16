'use server';

import { USER_ROLES } from '@/lib/auth/constants/auth';
import { getSession } from '@/lib/auth/utils/session';
import prisma from '@/lib/prisma';
import { SubscriptionPlanType } from '../../generated/prisma';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

// * ==========================================================================
// *                            SUPER ADMIN ACTIONS
// * ==========================================================================

// **  Toggle Logged-in SuperAdmin's Subscription Plan  ** //
export async function toggleUserSubscriptionPlan(
  newPlan?: SubscriptionPlanType // Valfri parameter om man vill sätta en specifik plan
): Promise<ActionResult> {
  const session = await getSession();

  if (session?.user?.role !== USER_ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Åtkomst nekad. Kräver SuperAdmin.' };
  }

  // Hämta den inloggade användarens ID från sessionen
  const loggedInUserId = session.user.id;
  if (!loggedInUserId) {
    return { success: false, error: 'Kunde inte identifiera inloggad användare.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      include: { subscription: true },
    });

    if (!user) {
      // Detta bör teoretiskt sett inte hända om sessionen är giltig
      return { success: false, error: 'Inloggad användare hittades inte i databasen.' };
    }

    let finalNewPlan: SubscriptionPlanType;

    if (newPlan) {
      finalNewPlan = newPlan;
    } else {
      // Toggle logik
      const currentPlan = user.subscription?.plan || SubscriptionPlanType.FREE;
      finalNewPlan =
        currentPlan === SubscriptionPlanType.FREE
          ? SubscriptionPlanType.PRO
          : SubscriptionPlanType.FREE;
    }

    await prisma.subscription.upsert({
      where: { userId: loggedInUserId }, // Använd loggedInUserId
      update: {
        plan: finalNewPlan,
        status: 'ACTIVE',
        currentPeriodStart: user.subscription?.currentPeriodStart,
        currentPeriodEnd: user.subscription?.currentPeriodEnd,
        updatedAt: new Date(),
      },
      create: {
        userId: loggedInUserId, // Använd loggedInUserId
        plan: finalNewPlan,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
      },
    });

    // Revalidera sökvägar som kan visa den inloggade användarens prenumerationsstatus
    // Exempel: /mina-sidor eller en specifik profilsida
    revalidatePath('/mina-sidor'); // Justera efter dina faktiska sökvägar
    // Om du har en mer specifik sida för den inloggade användarens profil:
    // revalidatePath(`/mina-sidor/profil/${loggedInUserId}`); 

    return {
      success: true,
      message: `Din prenumeration har ändrats till ${finalNewPlan}.`,
    };
  } catch (error) {
    console.error('Fel vid växling av egen prenumerationsplan:', error);
    return {
      success: false,
      error: 'Internt serverfel vid försök att växla din prenumerationsplan.',
    };
  }
} 