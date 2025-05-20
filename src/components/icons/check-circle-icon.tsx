import * as React from 'react';

interface CheckCircleIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const CheckCircleIcon: React.FC<CheckCircleIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Check-Circle--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Check Circle Streamline Icon: https://streamlinehq.com'}</desc>
    <g>
      <path d="M23.5 0.5 9.7 17.63a1 1 0 0 1 -1.49 0.08L4 13.5" />
      <path d="M18.27 12.49a9 9 0 1 1 -4.77 -6" />
    </g>
  </svg>
);
