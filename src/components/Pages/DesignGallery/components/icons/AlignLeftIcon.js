import React from 'react'
import PropTypes from 'prop-types'

const AlignLeftIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.53327 6.66037V4.52704L4.2666 7.72704L8.53327 10.927V8.79371H15.9999V6.66037H8.53327Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 15.1936H2.13333V0.261322H0V15.1936Z"
    />
  </svg>
)

AlignLeftIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignLeftIcon
