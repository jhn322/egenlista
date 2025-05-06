import * as React from 'react';

interface SettingsIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Cog-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Cog 1 Streamline Icon: https://streamlinehq.com"}</desc>
    <path d="M19.922 7.213a1.874 1.874 0 0 0 1.065 2.571l1.265 0.45a1.875 1.875 0 0 1 0 3.534l-1.265 0.45a1.874 1.874 0 0 0 -1.065 2.571L20.5 18a1.875 1.875 0 0 1 -2.5 2.5l-1.213 -0.576a1.874 1.874 0 0 0 -2.571 1.065l-0.45 1.265a1.875 1.875 0 0 1 -3.533 0l-0.45 -1.265a1.875 1.875 0 0 0 -2.572 -1.065L6 20.5A1.874 1.874 0 0 1 3.5 18l0.576 -1.213a1.874 1.874 0 0 0 -1.065 -2.571l-1.265 -0.45a1.875 1.875 0 0 1 0 -3.534l1.265 -0.45a1.874 1.874 0 0 0 1.065 -2.569L3.5 6A1.874 1.874 0 0 1 6 3.5l1.213 0.576a1.875 1.875 0 0 0 2.57 -1.063l0.45 -1.265a1.875 1.875 0 0 1 3.533 0l0.45 1.265a1.874 1.874 0 0 0 2.571 1.065L18 3.5A1.875 1.875 0 0 1 20.5 6Z" />
    <path d="M7.499 12.001a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0 -9 0Z" />
  </svg>
); 