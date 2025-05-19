import * as React from 'react';

interface QrCodeIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const QrCodeIcon: React.FC<QrCodeIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    id="Qr-Code--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    {...props}
  >
    <desc>{'Qr Code Streamline Icon: https://streamlinehq.com'}</desc>
    <title>{'qr-code'}</title>
    <path
      d="M0.5 0.5h7v7h-7Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M2.5 2.5h3v3h-3Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M0.5 16.5h7v7h-7Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M2.5 18.5h3v3h-3Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M16.5 16.5h3v3h-3Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M16.5 0.5h7v7h-7Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="M18.5 2.5h3v3h-3Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m13 9.5 -3.5 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m9.5 11.5 0 3 3.5 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m0.5 9.5 7 0 0 2"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m22.495 14.5 0 -5 1.005 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m20.495 11.5 0 3"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m20 9.5 -4.505 0 0 2"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m12.5 4.5 0 2 2 0 0 -4"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m9.5 7.5 0 -3"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m11.5 0.5 3 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m9.5 0.5 0 2 2 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m2.5 12.5 3 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m0.5 11.5 0 3 2 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m12.5 23.5 9 0 0 -7 2 0 0 3"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m9.5 17.5 0 4 3 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m19.5 21.5 -5 0 0 -2.5"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m11.495 19.5 0 -3 3.005 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m5.5 14.5 2 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m13 11.5 -2 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m15.495 14.5 3 0"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m17.495 14.5 0 -2"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </svg>
);
