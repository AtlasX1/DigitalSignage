import * as React from 'react'

function SvgClearDay(props) {
  return (
    <svg width={100} height={100} viewBox="0 0 26.458 26.458" {...props}>
      <defs>
        <linearGradient
          id="clear-day_svg__b"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="scale(40.91009 -40.91009) rotate(-45 -.164 -31.228)"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset={0} stopColor="#fdb727" />
          <stop offset={1} stopColor="#ffce22" />
        </linearGradient>
        <clipPath id="clear-day_svg__a" clipPathUnits="userSpaceOnUse">
          <path d="M895.401 393.404c0-11.296 9.157-20.454 20.455-20.454 11.297 0 20.455 9.158 20.455 20.454 0 11.298-9.158 20.456-20.455 20.456-11.298 0-20.455-9.158-20.455-20.456" />
        </clipPath>
      </defs>
      <g
        clipPath="url(#clear-day_svg__a)"
        transform="matrix(.50936 0 0 -.50936 -453.275 213.615)"
      >
        <path
          fill="url(#clear-day_svg__b)"
          d="M895.401 393.404c0-11.296 9.157-20.454 20.455-20.454 11.297 0 20.455 9.158 20.455 20.454 0 11.298-9.158 20.456-20.455 20.456-11.298 0-20.455-9.158-20.455-20.456"
        />
      </g>
    </svg>
  )
}

export default SvgClearDay
