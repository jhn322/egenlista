import * as React from 'react';

interface ChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Arrow-Left-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Arrow Left 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M18.4 0.5 5.825 11.626a0.5 0.5 0 0 0 0 0.748L18.4 23.5" />
  </svg>
);
