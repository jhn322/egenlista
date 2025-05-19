import * as React from 'react';

interface ChevronUpIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Chevron-Up--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Chevron Up Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M6 15l6-6 6 6" />
  </svg>
);
