// This route is called by the Vercel Cron Job. It, in turn, calls the
// actual cleanup worker (/api/auth/cleanup-unverified) with the required secret.

import { NextResponse } from 'next/server';
import { getEnvVar } from '@/lib/utils/env';

async function handleTrigger() {
  console.log('/api/internal/trigger-cleanup: Received request from cron job.');

  const cronSecret = process.env.CRON_SECRET;
  const appUrl = getEnvVar('NEXT_PUBLIC_APP_URL');

  if (!cronSecret) {
    console.error(
      '/api/internal/trigger-cleanup: CRON_SECRET is not set. Cannot trigger cleanup worker.'
    );
    return NextResponse.json(
      { message: 'Internal configuration error: Missing secret.' },
      { status: 500 }
    );
  }

  if (!appUrl) {
    console.error(
      '/api/internal/trigger-cleanup: NEXT_PUBLIC_APP_URL is not set. Cannot construct worker URL.'
    );
    return NextResponse.json(
      { message: 'Internal configuration error: Missing app URL.' },
      { status: 500 }
    );
  }

  const workerUrl = `${appUrl}/api/auth/cleanup-unverified`;

  try {
    console.log(
      `/api/internal/trigger-cleanup: Attempting to call worker: ${workerUrl}`
    );
    const response = await fetch(workerUrl, {
      method: 'POST', // The worker still expects POST
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        `/api/internal/trigger-cleanup: Error calling worker ${workerUrl}. Status: ${response.status}`,
        responseData
      );
      return NextResponse.json(
        {
          message: `Failed to trigger cleanup worker. Worker responded with status ${response.status}`,
          workerResponse: responseData,
        },
        { status: response.status || 500 }
      );
    }

    console.log(
      `/api/internal/trigger-cleanup: Successfully triggered cleanup worker. Worker response:`,
      responseData
    );
    return NextResponse.json(
      {
        message: 'Cleanup worker triggered successfully.',
        workerResponse: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `/api/internal/trigger-cleanup: Exception when trying to call worker ${workerUrl}:`,
      error
    );
    return NextResponse.json(
      { message: 'Exception occurred while triggering cleanup worker.' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return handleTrigger();
}

export async function GET() {
  return handleTrigger();
}
