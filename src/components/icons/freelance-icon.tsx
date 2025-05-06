import * as React from 'react';

interface FreelanceIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const FreelanceIcon: React.FC<FreelanceIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    id="Workflow-Teamwork-Handshake--Streamline-Ultimate"
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
      {'Workflow Teamwork Handshake Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="m10.176 10.656 4.788 -2.324a1.821 1.821 0 0 1 2.437 0.833l-0.014 1.8 1.332 0.889 -0.086 1.65 1.442 1.113a1.821 1.821 0 0 1 -0.833 2.437l-6.813 3.323 -2.081 2.657" />
    <path d="M10.946 13.576a2.429 2.429 0 0 0 -1.154 -3.155l-3.6 -1.765 -1.451 0.984 0.218 1.5 -1.609 1.246 -0.019 2.023 -1.41 0.9 0.154 1.627 3.754 1.842a2.428 2.428 0 0 0 3.293 -1.205Z" />
    <path d="m4.817 18.277 -3.739 4.755" />
    <path d="m11.994 20.93 1.645 2.102" />
    <path d="m18.517 17.406 4.405 5.626" />
    <path d="M13.379 9.065 9.353 7.058a0.984 0.984 0 0 0 -1.316 0.449l-0.16 0.326a1.475 1.475 0 0 0 0.675 1.973l0.924 0.454" />
    <path d="m10.212 7.486 2.126 -1.023a0.983 0.983 0 0 1 1.316 0.45l0.16 0.326a1.475 1.475 0 0 1 -0.675 1.973l-0.924 0.453" />
    <path d="m11.994 0.968 0 2" />
    <path d="m21.54 4.922 -1.415 1.414" />
    <path d="m2.448 4.922 1.414 1.414" />
  </svg>
);
