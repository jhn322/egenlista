import * as React from 'react';

interface XCircleIconProps extends React.SVGProps<SVGSVGElement> {
  iconSize?: number;
}

export const XCircleIcon: React.FC<XCircleIconProps> = ({
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Close--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    {...props}
  >
    <desc>{'Close Streamline Icon: https://streamlinehq.com'}</desc>
    <path
      d="m0.5 0.499 23 23"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
    <path
      d="m23.5 0.499 -23 23"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </svg>
);
