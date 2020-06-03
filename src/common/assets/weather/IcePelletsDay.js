import * as React from 'react'

function SvgIcePelletsDay(props) {
  return (
    <svg width={100} height={100} viewBox="0 0 26.458 26.458" {...props}>
      <defs>
        <linearGradient
          id="ice-pellets-day_svg__a"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="scale(40.91009 -40.91009) rotate(-45 -1.543 -15.708)"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset={0} stopColor="#fdb727" />
          <stop offset={1} stopColor="#ffce22" />
        </linearGradient>
        <clipPath id="ice-pellets-day_svg__b" clipPathUnits="userSpaceOnUse">
          <path d="M0 943.388h1828.656V0H0z" />
        </clipPath>
      </defs>
      <path
        fill="url(#ice-pellets-day_svg__a)"
        d="M429.925 247.323c0-11.297 9.158-20.456 20.455-20.456 11.297 0 20.455 9.159 20.455 20.456 0 11.296-9.158 20.455-20.455 20.455-11.297 0-20.455-9.159-20.455-20.455"
        transform="matrix(.35278 0 0 -.35278 -149.455 100.479)"
      />
      <g
        clipPath="url(#ice-pellets-day_svg__b)"
        transform="matrix(.35278 0 0 -.35278 -149.455 100.479)"
      >
        <path
          fill="#F4F4F4"
          d="M462.38 247.621a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m-20-14a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m-25 7a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002m10 0a2 2 0 10-4.002.002 2 2 0 004.002-.002"
        />
      </g>
    </svg>
  )
}

export default SvgIcePelletsDay
