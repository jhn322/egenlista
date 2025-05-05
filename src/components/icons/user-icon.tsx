import * as React from 'react';

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const UserIcon: React.FC<UserIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Single-Neutral--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Single Neutral Streamline Icon: https://streamlinehq.com"}</desc>
    <path d="M6.5 6.75a5.5 5.5 0 1 0 11 0 5.5 5.5 0 1 0 -11 0Z" />
    <path d="M3 22.75a9 9 0 0 1 18 0Z" />
  </svg>
); 