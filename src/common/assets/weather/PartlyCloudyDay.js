import * as React from 'react'

function SvgPartlyCloudyDay(props) {
  return (
    <svg width={100} height={100} viewBox="0 0 26.458 26.458" {...props}>
      <defs>
        <clipPath id="partly-cloudy-day_svg__a" clipPathUnits="userSpaceOnUse">
          <path d="M766.19 404.905c0-7.16 5.803-12.963 12.962-12.963 7.16 0 12.964 5.803 12.964 12.963 0 7.159-5.804 12.963-12.964 12.963-7.159 0-12.962-5.804-12.962-12.963" />
        </clipPath>
        <clipPath id="partly-cloudy-day_svg__c" clipPathUnits="userSpaceOnUse">
          <path d="M0 943.388h1828.656V0H0z" />
        </clipPath>
        <clipPath id="partly-cloudy-day_svg__d" clipPathUnits="userSpaceOnUse">
          <path d="M770.609 394.18c-.052.001-.105.004-.159.004a8.288 8.288 0 010-16.576h20.6a6.696 6.696 0 010 13.393c-.023 0-.045-.003-.069-.004-.596 5.34-5.122 9.493-10.621 9.493-4.343 0-8.078-2.592-9.751-6.31" />
        </clipPath>
        <linearGradient
          id="partly-cloudy-day_svg__b"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="scale(25.92643 -25.92643) rotate(-45 -3.576 -43.482)"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset={0} stopColor="#fdb727" />
          <stop offset={1} stopColor="#ffce22" />
        </linearGradient>
        <linearGradient
          id="partly-cloudy-day_svg__e"
          x1={0}
          x2={1}
          y1={0}
          y2={0}
          gradientTransform="scale(28.74394 -28.74394) rotate(-45 -2.364 -38.842)"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset={0} stopColor="#d0e8f8" />
          <stop offset={1} stopColor="#e2eef9" />
        </linearGradient>
      </defs>
      <g
        clipPath="url(#partly-cloudy-day_svg__a)"
        transform="matrix(.35278 0 0 -.35278 -256.395 153.542)"
      >
        <path
          fill="url(#partly-cloudy-day_svg__b)"
          d="M766.19 404.905c0-7.16 5.803-12.963 12.962-12.963 7.16 0 12.964 5.803 12.964 12.963 0 7.159-5.804 12.963-12.964 12.963-7.159 0-12.962-5.804-12.962-12.963"
        />
      </g>
      <g
        clipPath="url(#partly-cloudy-day_svg__c)"
        transform="matrix(.35278 0 0 -.35278 -256.395 153.542)"
      >
        <path
          fill="#F4F4F4"
          d="M776.833 377.608c5.889 0 10.664 4.774 10.664 10.664s-4.775 10.663-10.664 10.663c-.037 0-.073-.005-.11-.005-.948 8.504-8.157 15.116-16.914 15.116-6.916 0-12.864-4.125-15.53-10.048-.083.002-.166.006-.251.006-7.29 0-13.198-5.909-13.198-13.198 0-7.289 5.909-13.198 13.198-13.198"
        />
      </g>
      <g
        clipPath="url(#partly-cloudy-day_svg__d)"
        transform="matrix(.35278 0 0 -.35278 -256.395 153.542)"
      >
        <path
          fill="url(#partly-cloudy-day_svg__e)"
          d="M770.609 394.18c-.052.001-.105.004-.159.004a8.288 8.288 0 010-16.576h20.6a6.696 6.696 0 010 13.393c-.023 0-.045-.003-.069-.004-.596 5.34-5.122 9.493-10.621 9.493-4.343 0-8.078-2.592-9.751-6.31"
        />
      </g>
    </svg>
  )
}

export default SvgPartlyCloudyDay
