import React from 'react'
import PropTypes from 'prop-types'

const TextIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 2H5C4.448 2 4 2.448 4 3V6H6V4H11V20H8V22H16V20H13V4H18V6H20V3C20 2.448 19.552 2 19 2Z" />
  </svg>
)

TextIcon.propTypes = {
  fill: PropTypes.string
}

export default TextIcon
