import * as React from 'react';

interface ShieldCheckIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ShieldCheckIcon: React.FC<ShieldCheckIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Shield-Check--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Shield Check Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M12 22c-4.97-1.67-8.5-6.13-8.5-11.5V4.5l8.5-3 8.5 3v6c0 5.37-3.53 9.83-8.5 11.5Z" />
    <path d="M9.5 12.5l2 2 3-3" />
  </svg>
);
