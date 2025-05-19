import * as React from 'react';

interface CircleIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const CircleIcon: React.FC<CircleIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Circle--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Circle Streamline Icon: https://streamlinehq.com'}</desc>
    <circle cx="12" cy="12" r="10" />
  </svg>
);
