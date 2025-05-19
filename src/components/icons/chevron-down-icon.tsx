import * as React from 'react';

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Chevron-Down--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Chevron Down Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
