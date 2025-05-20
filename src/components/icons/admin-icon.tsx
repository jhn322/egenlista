import * as React from 'react';

interface AdminIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const AdminIcon: React.FC<AdminIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Layout-Corners-Dashboard-1--Streamline-Ultimate"
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
      {'Layout Corners Dashboard 1 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M0.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0 -9 0Z" />
    <path d="M14.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0 -9 0Z" />
    <path d="M0.5 19a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0 -9 0Z" />
    <path d="M14.5 19a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0 -9 0Z" />
  </svg>
);
