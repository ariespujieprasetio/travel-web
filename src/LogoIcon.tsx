import React from "react";

interface IconProps {
  color?: string;
  width?: number;
  height?: number;
}

const LogoIcon: React.FC<IconProps> = ({
  color = "white",
  width = 291,
  height = 295,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 291 295"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.99998 126.327L107.49 65.6723" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M92.9844 280.443L158.89 241.433" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M27.7543 65.6723L130.244 5" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M164.679 289.021L252.906 236.806" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M158.7 39.296L201.851 13.7343" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M238.92 95.9998L267.307 79.207" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M6.16108 178.612L57.5618 148.198" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M53.2987 253.166L92.9844 229.683" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M138.268 100.124L241.035 39.296" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M215.923 209.026L285.625 167.763" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M182.875 178.612L285.625 117.784" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M24.6522 219.355L185.475 124.161" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <path d="M120.192 153.709L76.6422 118.667C76.2783 118.373 76.5902 117.784 77.0408 117.922L145.616 138.58" fill={color}/>
    <path d="M127.228 167.885L136.309 223.029C136.379 223.497 137.037 223.514 137.141 223.046L152.877 153.171" fill={color}/>
  </svg>
);

export default LogoIcon;
