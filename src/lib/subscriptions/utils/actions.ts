// * ==========================================================================
// *                        SUBSCRIPTION UTILITY ACTIONS
// * ==========================================================================
import prisma from '@/lib/prisma';
import { SubscriptionPlanType, SubscriptionStatus } from '@/generated/prisma';

// **  Check if a user has an active PRO subscription  ** //
export async function isUserPro(userId: string): Promise<boolean> {
  if (!userId) {
    console.warn('User ID is required to check PRO status.');
    return false;
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
      select: {
        plan: true,
        status: true,
      },
    });

    if (!subscription) {
      return false; // No subscription record, so not PRO
    }

    // User is PRO if they have a PRO plan and it's active or trialing
    const isProPlan = subscription.plan === SubscriptionPlanType.PRO;
    const isActiveOrTrialing =
      subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.TRIALING;

    return isProPlan && isActiveOrTrialing;
  } catch (error) {
    console.error(`Error checking PRO status for user ${userId}:`, error);
    // In case of an error, assume not PRO to be safe
    return false;
  }
} 