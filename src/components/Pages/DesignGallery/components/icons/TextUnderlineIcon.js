import React from 'react'
import PropTypes from 'prop-types'

const TextUnderlineIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2.66699" y="13.3333" width="10.6667" height="1.33333" />
    <path d="M9.33366 1.33333V2.66666H10.667V7.99999C10.667 9.47066 9.47099 10.6667 8.00033 10.6667C6.52966 10.6667 5.33366 9.47066 5.33366 7.99999V2.66666H6.66699V1.33333H2.66699V2.66666H4.00033V7.99999C4.00033 10.206 5.79433 12 8.00033 12C10.2063 12 12.0003 10.206 12.0003 7.99999V2.66666H13.3337V1.33333H9.33366Z" />
  </svg>
)

TextUnderlineIcon.propTypes = {
  fill: PropTypes.string
}

export default TextUnderlineIcon
