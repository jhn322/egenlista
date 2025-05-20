import * as React from 'react';

interface RepeatIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const RepeatIcon: React.FC<RepeatIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Repeat--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Repeat Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M3 12a9 9 0 0 1 9-9h2" />
    <path d="M21 12a9 9 0 0 1-9 9h-2" />
    <path d="M8 5l3-3 3 3" />
    <path d="M16 19l-3 3-3-3" />
  </svg>
);
