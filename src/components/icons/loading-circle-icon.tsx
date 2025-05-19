import * as React from 'react';

interface LoadingCircleIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const LoadingCircleIcon: React.FC<LoadingCircleIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Loading-Circle-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Loading Circle 1 Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M16.5 22.038A11 11 0 1 1 12 1" />
    <path d="M18.684 3.262c0.246 0.187 0.483 0.386 0.712 0.593s0.449 0.426 0.659 0.652" />
    <path d="M21.75 6.905q0.215 0.411 0.394 0.839t0.322 0.869" />
    <path d="M22.989 11.5q0.021 0.463 0 0.927c-0.013 0.308 -0.038 0.617 -0.076 0.923" />
    <path d="M22.169 16.193q-0.177 0.429 -0.39 0.841t-0.458 0.806" />
    <path d="M15.286 1.5q0.481 0.15 0.943 0.343" />
    <path d="M19.725 19.829c-0.237 0.234 -0.485 0.458 -0.743 0.669" />
    <path d="M12 4a8 8 0 1 1 -8 8" />
  </svg>
);
