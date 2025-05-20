import * as React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const StarIcon: React.FC<StarIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Rating-Star-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Rating Star 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M11.551 5.745a0.5 0.5 0 0 1 0.9 0L14.3 9.483l4.144 0.6a0.5 0.5 0 0 1 0.276 0.854l-3 2.9 0.708 4.1a0.5 0.5 0 0 1 -0.724 0.528L12 16.531 8.289 18.47a0.5 0.5 0 0 1 -0.724 -0.528l0.708 -4.1 -3 -2.9a0.5 0.5 0 0 1 0.276 -0.854l4.145 -0.6Z" />
  </svg>
);
