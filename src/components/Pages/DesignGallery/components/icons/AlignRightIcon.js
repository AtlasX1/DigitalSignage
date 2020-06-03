import React from 'react'
import PropTypes from 'prop-types'

const AlignRightIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.46667 6.4H0V8.53333H7.46667V10.6667L11.7333 7.46666L7.46667 4.26666V6.4Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.8667 14.9333H16V0H13.8667V14.9333Z"
    />
  </svg>
)

AlignRightIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignRightIcon
