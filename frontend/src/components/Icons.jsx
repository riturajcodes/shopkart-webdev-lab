import React from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

const icon = (children, overrides) => {
  const Icon = (props) => (
    <svg {...base} {...overrides} {...props}>
      {children}
    </svg>
  );
  return Icon;
};

export const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

export const UserIcon = icon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </>,
);

export const HeartIcon = icon(
  <path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 2.9c0 6.1-8 11-8 11Z" />,
);

export const BagIcon = icon(
  <>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>,
);

export const MenuIcon = icon(
  <>
    <path d="M3 7h18" />
    <path d="M3 12h18" />
    <path d="M3 17h18" />
  </>,
);

export const CloseIcon = icon(
  <>
    <path d="M5 5l14 14" />
    <path d="M19 5 5 19" />
  </>,
);

export const ArrowRightIcon = icon(
  <>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </>,
);

export const TruckIcon = icon(
  <>
    <path d="M2 6h11v10H2z" />
    <path d="M13 9h4l4 4v3h-8" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </>,
);

export const ReturnIcon = icon(
  <>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </>,
);

export const ShieldIcon = icon(
  <>
    <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

export const ChatIcon = icon(
  <path d="M4 5h16v11H9l-5 4V5Z" />,
);

export const InstagramIcon = icon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </>,
);

export const FacebookIcon = icon(
  <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5H14Z" />,
);

export const XIcon = icon(
  <>
    <path d="M4 4l16 16" />
    <path d="M20 4 4 20" />
  </>,
);

export const YoutubeIcon = icon(
  <>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
  </>,
);
