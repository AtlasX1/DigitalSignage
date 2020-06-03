import * as React from 'react'

function SvgCloudyDay(props) {
  return (
    <svg width={100} height={100} viewBox="0 0 26.458 26.458" {...props}>
      <defs>
        <linearGradient
          id="cloudy-day_svg__b"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="scale(28.74394 -28.74394) rotate(-45 -6.055 -47.829)"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset={0} stopColor="#d0e8f8" />
          <stop offset={1} stopColor="#e2eef9" />
        </linearGradient>
        <clipPath id="cloudy-day_svg__a" clipPathUnits="userSpaceOnUse">
          <path d="M922.177 544.87c-.053.001-.105.003-.159.003a8.288 8.288 0 010-16.575h20.6a6.696 6.696 0 010 13.393c-.023 0-.045-.004-.069-.004-.596 5.34-5.122 9.493-10.622 9.493-4.341 0-8.077-2.591-9.75-6.31" />
        </clipPath>
      </defs>
      <path
        fill="#F4F4F4"
        d="M17.655 19.656a3.762 3.762 0 000-7.524l-.039.002a6.006 6.006 0 00-11.445-1.787l-.09-.003a4.656 4.656 0 000 9.312"
      />
      <g
        clipPath="url(#cloudy-day_svg__a)"
        transform="matrix(.35278 0 0 -.35278 -309.864 206.028)"
      >
        <path
          fill="url(#cloudy-day_svg__b)"
          d="M922.177 544.87c-.053.001-.105.003-.159.003a8.288 8.288 0 010-16.575h20.6a6.696 6.696 0 010 13.393c-.023 0-.045-.004-.069-.004-.596 5.34-5.122 9.493-10.622 9.493-4.341 0-8.077-2.591-9.75-6.31"
        />
      </g>
    </svg>
  )
}

export default SvgCloudyDay
