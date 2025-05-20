import * as React from 'react';

interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Arrow-Right-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Arrow Right 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="m5.651 23.5 12.576 -11.126a0.5 0.5 0 0 0 0 -0.748L5.651 0.5" />
  </svg>
);
