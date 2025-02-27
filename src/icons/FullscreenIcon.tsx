import React from "react"

const FullscreenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 15V10H6.5V13.5H10V15H5ZM13.5 10V6.5H10V5H15V10H13.5Z"
      fill="currentColor"
    />
  </svg>
)

export default FullscreenIcon
