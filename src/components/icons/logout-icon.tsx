import * as React from 'react';

interface LogOutIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const LogOutIcon: React.FC<LogOutIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Logout-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Logout 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M13.5 5V1.5a1 1 0 0 0 -1 -1h-11a1 1 0 0 0 -1 1v21a1 1 0 0 0 1 1h11a1 1 0 0 0 1 -1V19" />
    <path d="m23.5 12 -19 0" />
    <path d="m18.5 17 5 -5 -5 -5" />
  </svg>
);
