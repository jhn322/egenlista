import * as React from 'react';

interface NoteIconProps extends React.SVGProps<SVGSVGElement> {
  iconSize?: number;
}

export const NoteIcon: React.FC<NoteIconProps> = ({
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Notes-Paper--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    {...props}
  >
    <desc>{'Notes Paper Streamline Icon: https://streamlinehq.com'}</desc>
    <path
      d="M16.5 23.5h-15a1 1 0 0 1 -1 -1v-21a1 1 0 0 1 1 -1h21a1 1 0 0 1 1 1v15Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M16.5 23.5v-6a1 1 0 0 1 1 -1h6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);
