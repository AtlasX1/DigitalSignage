import React from 'react'
import PropTypes from 'prop-types'

const AlignBottomIcon = ({ fill = 'currentColor' }) => (
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
      d="M10.6666 7.46667H8.53327V0H6.39994V7.46667H4.2666L7.4666 11.7333L10.6666 7.46667Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 16H14.9333V13.8667H0V16Z"
    />
  </svg>
)

AlignBottomIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignBottomIcon
