import * as React from 'react';

interface ChevronsLeftIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronsLeftIcon: React.FC<ChevronsLeftIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Arrow-Button-Left-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>
      {'Arrow Button Left 1 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M23.4 23.5 12.6 12.707a1 1 0 0 1 0 -1.414L23.4 0.5" />
    <path d="M11.9 23.5 1.1 12.707a1 1 0 0 1 0 -1.414L11.9 0.5" />
  </svg>
);
