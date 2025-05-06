import * as React from 'react';

interface SmallBusinessIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const SmallBusinessIcon: React.FC<SmallBusinessIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Office-Building-Tall-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>
      {'Office Building Tall 1 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M6.75 4.25v1" />
    <path d="M6.75 9.25v1" />
    <path d="M6.75 14.25v1" />
    <path d="M12 4.25v1" />
    <path d="M12 9.25v1" />
    <path d="M12 14.25v1" />
    <path d="M17.25 4.25v1" />
    <path d="M17.25 9.25v1" />
    <path d="M17.25 14.25v1" />
    <path d="M21 23.25H3V1.75c0 -0.6 0.4 -1 1 -1h16c0.6 0 1 0.4 1 1v21.5Z" />
    <path d="M14 23.25v-2.5c0 -1.1 -0.9 -2 -2 -2s-2 0.9 -2 2v2.5" />
    <path d="M23.25 23.25H0.75" />
    <path d="M6.75 19.25v1" />
    <path d="M17.25 19.25v1" />
  </svg>
);
