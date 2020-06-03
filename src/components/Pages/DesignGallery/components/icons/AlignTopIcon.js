import React from 'react'
import PropTypes from 'prop-types'

const AlignTopIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.26685 8.53312H6.40018V15.9998H8.53351V8.53312H10.6668L7.46685 4.26645L4.26685 8.53312Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 2.13333H14.9333V0H0V2.13333Z"
    />
  </svg>
)

AlignTopIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignTopIcon
