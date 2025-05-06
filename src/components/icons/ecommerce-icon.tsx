import * as React from 'react';

interface EcommerceIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const EcommerceIcon: React.FC<EcommerceIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    id="Shopping-Cart-Empty-1--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    {...props}
  >
    <desc>
      {'Shopping Cart Empty 1 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M3.707 5.5h18.638a1 1 0 0 1 0.965 1.263l-2.053 7.526a3 3 0 0 1 -2.894 2.211H6.023" />
    <path d="M0.654 0.5h0.378a2 2 0 0 1 1.957 1.588L6.32 17.912A2 2 0 0 0 8.277 19.5h11.377" />
    <path d="M6.154 22a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
    <path d="M16.154 22a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0 -3 0Z" />
  </svg>
);
