import React from 'react'
import PropTypes from 'prop-types'

const TextThroughIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.00033 2.66666H7.33366V5.99999H8.66699V2.66666H12.0003V3.99999H13.3337V1.99999C13.3337 1.63199 13.0357 1.33333 12.667 1.33333H3.33366C2.96566 1.33333 2.66699 1.63199 2.66699 1.99999V3.99999H4.00033V2.66666Z" />
    <path d="M14 8.66666V7.33333H2V8.66666H7.33333V13.3333H5.33333V14.6667H10.6667V13.3333H8.66667V8.66666H14Z" />
  </svg>
)

TextThroughIcon.propTypes = {
  fill: PropTypes.string
}

export default TextThroughIcon
