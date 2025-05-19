'use client';

import { useQRCode } from 'next-qrcode';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { APP_NAME } from '@/lib/constants/site';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { SITE_PATHS } from '@/lib/constants/routes';
import { DownloadIcon } from '@/components/icons/download-icon';
import { LinkIcon } from '@/components/icons/link-icon';
import { toast } from 'sonner';

interface QRCodeModalProps {
  triggerButton: React.ReactNode;
  title?: string;
  description?: string;
  qrCodeText?: string;
}

export function QRCodeModal({
  triggerButton,
  title = `Din unika QR-kod hos ${APP_NAME}`,
  description = `Visa denna QR-kod för att låta andra enkelt registrera sig via din unika länk.`,
  qrCodeText,
}: QRCodeModalProps) {
  const { Canvas } = useQRCode();
  const { data: session, status: sessionStatus } = useSession();
  const [urlToEncode, setUrlToEncode] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrCodeText) {
      setUrlToEncode(qrCodeText);
    } else if (sessionStatus === 'authenticated' && session?.user?.id) {
      const baseUrl = 'https://egen-lista.vercel.app';
      setUrlToEncode(`${baseUrl}${SITE_PATHS.SIGNUP}/${session.user.id}`);
    } else if (sessionStatus !== 'loading' && !qrCodeText) {
      setUrlToEncode('');
    }
  }, [session, sessionStatus, qrCodeText]);

  const handleDownloadClick = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-kod.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleCopyLink = async (
    event?:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!urlToEncode) return;
    try {
      await navigator.clipboard.writeText(urlToEncode);
      toast.success('Länk kopierad till urklipp!');
      if (
        event &&
        event.currentTarget &&
        typeof event.currentTarget.blur === 'function'
      ) {
        event.currentTarget.blur();
      } else if (qrCodeRef.current) {
        qrCodeRef.current.blur();
      }
    } catch (err) {
      toast.error('Kunde inte kopiera länken.');
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <div
              ref={qrCodeRef}
              className="group relative flex items-center justify-center py-4"
            >
              {sessionStatus === 'loading' && !qrCodeText && !urlToEncode ? (
                <p>Laddar användarinformation...</p>
              ) : urlToEncode ? (
                <TooltipTrigger asChild>
                  <div
                    className="relative h-[256px] w-[256px] cursor-pointer transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 focus:outline-none"
                    onClick={(e) => handleCopyLink(e)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' || e.key === ' '
                        ? handleCopyLink(e)
                        : null
                    }
                    tabIndex={0}
                    role="button"
                    aria-label="Klicka för att kopiera länken"
                  >
                    <Canvas
                      text={urlToEncode}
                      options={{
                        errorCorrectionLevel: 'M',
                        margin: 3,
                        scale: 4,
                        width: 256,
                        color: {
                          dark: '#000000',
                          light: '#FFFFFF',
                        },
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <div className="rounded-lg bg-black/60 p-2.5 shadow-lg">
                        <LinkIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
              ) : (
                <p className="text-destructive">
                  Kunde inte generera QR-kod. Nödvändig information saknas eller
                  kunde inte hämtas.
                </p>
              )}
            </div>
            {urlToEncode && (
              <TooltipContent>
                <p>Klicka för att kopiera länken</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <DialogFooter className="sm:flex-col sm:items-stretch sm:space-y-2 md:flex-row md:justify-between md:space-y-0">
          {urlToEncode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadClick}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Ladda ner QR
            </Button>
          )}
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className={!urlToEncode ? 'w-full' : ''}
              autoFocus
            >
              Stäng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
