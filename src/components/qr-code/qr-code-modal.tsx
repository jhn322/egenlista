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
import { APP_NAME } from '@/lib/constants/site';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { SITE_PATHS } from '@/lib/constants/routes';
import { Download } from 'lucide-react';

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div
          ref={qrCodeRef}
          className="flex min-h-[256px] items-center justify-center py-4"
        >
          {sessionStatus === 'loading' && !qrCodeText && !urlToEncode ? (
            <p>Laddar användarinformation...</p>
          ) : urlToEncode ? (
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
          ) : (
            <p className="text-destructive">
              Kunde inte generera QR-kod. Nödvändig information saknas eller
              kunde inte hämtas.
            </p>
          )}
        </div>
        <DialogFooter className="sm:flex-col sm:items-stretch sm:space-y-2 md:flex-row md:justify-between md:space-y-0">
          {urlToEncode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadClick}
            >
              <Download className="mr-2 h-4 w-4" />
              Ladda ner QR
            </Button>
          )}
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className={!urlToEncode ? 'w-full' : ''}
            >
              Stäng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
