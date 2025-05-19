import * as React from 'react';

interface TrashIconProps extends React.SVGProps<SVGSVGElement> {
  iconSize?: number;
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Bin-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Bin 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="m21 4.5 -1.812 17.209A2 2 0 0 1 17.2 23.5H6.8a2 2 0 0 1 -1.989 -1.791L3 4.5" />
    <path d="m0.5 4.5 23 0" />
    <path d="M7.5 4.5v-3a1 1 0 0 1 1 -1h7a1 1 0 0 1 1 1v3" />
    <path d="m12 9 0 10.5" />
    <path d="M16.5 9 16 19.5" />
    <path d="M7.5 9 8 19.5" />
  </svg>
);
