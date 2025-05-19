import * as React from 'react';

interface CalendarIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Calendar--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Calendar Streamline Icon: https://streamlinehq.com'}</desc>
    <rect x="2.5" y="4.5" width="19" height="17" rx="2" />
    <path d="M2.5 8.5h19" />
    <path d="M7.5 2.5v4" />
    <path d="M16.5 2.5v4" />
    <circle cx="7.5" cy="12.5" r="1" />
    <circle cx="12" cy="12.5" r="1" />
    <circle cx="16.5" cy="12.5" r="1" />
    <circle cx="7.5" cy="16.5" r="1" />
    <circle cx="12" cy="16.5" r="1" />
    <circle cx="16.5" cy="16.5" r="1" />
  </svg>
);
