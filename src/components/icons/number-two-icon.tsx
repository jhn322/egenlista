import * as React from 'react';

interface NumberTwoIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const NumberTwoIcon: React.FC<NumberTwoIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Number-Two-Circle--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Number Two Circle Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M14 16h-4v-1.2957c0 -0.7113 0.3778 -1.3691 0.9923 -1.7276l2.0154 -1.1757c0.6145 -0.3584 0.9923 -1.0162 0.9923 -1.7275V10c0 -1.10457 -0.8954 -2 -2 -2 -0.8708 0 -1.7254 0.55654 -2 1.33333" />
    <path d="M0.75 12a11.25 11.25 0 1 0 22.5 0 11.25 11.25 0 1 0 -22.5 0" />
  </svg>
);
