import * as React from 'react';

interface BriefcaseIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const BriefcaseIcon: React.FC<BriefcaseIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Products-Briefcase--Streamline-Ultimate"
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
      {'Products Briefcase Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="m1.5 15.5 0.739 4.8A2 2 0 0 0 4.216 22h15.568a2 2 0 0 0 1.977 -1.7l0.739 -4.8a1 1 0 0 0 1 -1V8a2 2 0 0 0 -2 -2h-19a2 2 0 0 0 -2 2v6.5a1 1 0 0 0 1 1Z" />
    <path d="M16.5 6h-9V5a3 3 0 0 1 3 -3h3a3 3 0 0 1 3 3Z" />
    <path d="m1.5 15.5 8.5 0" />
    <path d="m14 15.5 8.5 0" />
    <path d="M10 15.5a2 2.5 0 1 0 4 0 2 2.5 0 1 0 -4 0Z" />
  </svg>
);
