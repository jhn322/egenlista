import * as React from 'react';

interface NumberThreeIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const NumberThreeIcon: React.FC<NumberThreeIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Number-Three-Circle--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>
      {'Number Three Circle Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M10 14.6667C10.2746 15.4435 11.1292 16 12 16c1.1046 0 2 -0.8954 2 -2v-0.3333c0 -1.1046 -0.8954 -2 -2 -2h-0.0667c0.9573 0 1.7334 -0.7761 1.7334 -1.73335v-0.26669C13.6667 8.74619 12.9205 8 12 8c-0.5453 0 -1.0294 0.26185 -1.3335 0.66667" />
    <path d="M0.75 12a11.25 11.25 0 1 0 22.5 0 11.25 11.25 0 1 0 -22.5 0" />
  </svg>
);
