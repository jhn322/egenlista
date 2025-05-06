import * as React from 'react';

interface AnalyticsIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const AnalyticsIcon: React.FC<AnalyticsIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Analytics-Graph-Bar--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>
      {'Analytics Graph Bar Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="m0.504 23.5 23 0" />
    <path d="M4.5 19a0.5 0.5 0 0 0 -0.5 -0.5H2a0.5 0.5 0 0 0 -0.5 0.5v4.5h3Z" />
    <path d="M10.5 14a0.5 0.5 0 0 0 -0.5 -0.5H8a0.5 0.5 0 0 0 -0.5 0.5v9.5h3Z" />
    <path d="M16.5 16a0.5 0.5 0 0 0 -0.5 -0.5h-2a0.5 0.5 0 0 0 -0.5 0.5v7.5h3Z" />
    <path d="M22.5 9a0.5 0.5 0 0 0 -0.5 -0.5h-2a0.5 0.5 0 0 0 -0.5 0.5v14.5h3Z" />
    <path d="M1.504 11.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
    <path d="M7.504 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
    <path d="M13.504 8.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
    <path d="M19.504 2a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
    <path d="m4.265 10.45 3.587 -2.99" />
    <path d="m10.427 6.974 3.154 1.051" />
    <path d="m19.804 2.9 -3.759 4.385" />
  </svg>
);
