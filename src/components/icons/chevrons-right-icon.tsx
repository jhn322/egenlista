import * as React from 'react';

interface ChevronsRightIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronsRightIcon: React.FC<ChevronsRightIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Arrow-Button-Right-1--Streamline-Ultimate"
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
      {'Arrow Button Right 1 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="m0.8 0.5 10.792 10.793a1 1 0 0 1 0 1.414L0.8 23.5" />
    <path d="m12.3 0.5 10.792 10.793a1 1 0 0 1 0 1.414L12.3 23.5" />
  </svg>
);
