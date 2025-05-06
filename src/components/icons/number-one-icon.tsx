import * as React from 'react';

interface NumberOneIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const NumberOneIcon: React.FC<NumberOneIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Number-One-Circle--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Number One Circle Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="m12 16 0 -8v0.66667C12 9.40304 11.403 10 10.6667 10L10 10" />
    <path d="M14 16h-4" />
    <path d="M0.75 12a11.25 11.25 0 1 0 22.5 0 11.25 11.25 0 1 0 -22.5 0" />
  </svg>
);
