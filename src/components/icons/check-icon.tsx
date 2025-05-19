import * as React from 'react';

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  color = 'white',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Check--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Check Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M20 6 9.5 17 4 11.5" />
  </svg>
);
