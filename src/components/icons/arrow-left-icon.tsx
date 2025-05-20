import * as React from 'react';

interface ArrowLeftIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Direction-Left--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Direction Left Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="m23.5 12 -23 0" />
    <path d="M7.25 18.5 0.5 12l6.75 -6.5" />
  </svg>
);
