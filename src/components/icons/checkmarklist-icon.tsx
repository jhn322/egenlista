import * as React from 'react';

interface CheckmarklistIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const CheckmarklistIcon: React.FC<CheckmarklistIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Checklist--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Checklist Streamline Icon: https://streamlinehq.com'}</desc>
    <title>{'checklist'}</title>
    <path d="M2.5 0.499h19s2 0 2 2v19s0 2 -2 2h-19s-2 0 -2 -2v-19s0 -2 2 -2" />
    <path d="m5 7.499 1.5 1.5 4 -4" />
    <path d="m5 17.499 1.5 1.5 4 -4" />
    <path d="m13.5 8.499 6 0" />
    <path d="m13.5 17.499 6 0" />
  </svg>
);
