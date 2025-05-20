import * as React from 'react';

interface LinkIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const LinkIcon: React.FC<LinkIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Link--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Link Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M10.59 13.41a2 2 0 0 1 0-2.82l3.18-3.18a2 2 0 0 1 2.82 2.82l-1.06 1.06" />
    <path d="M13.41 10.59a2 2 0 0 1 0 2.82l-3.18 3.18a2 2 0 0 1-2.82-2.82l1.06-1.06" />
  </svg>
);
