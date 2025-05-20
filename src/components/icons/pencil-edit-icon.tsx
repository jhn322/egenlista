import * as React from 'react';

interface PencilEditIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const PencilEditIcon: React.FC<PencilEditIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Edit-Pencil--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Edit Pencil Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M20.5 7.5 16.5 3.5a2 2 0 0 0 -2.828 0l-9.172 9.172a2 2 0 0 0 -.5 1l-1 4.5a1 1 0 0 0 1.212 1.212l4.5 -1a2 2 0 0 0 1 -.5l9.172 -9.172a2 2 0 0 0 0 -2.828Z" />
    <path d="M15.5 6.5 17.5 8.5" />
  </svg>
);
