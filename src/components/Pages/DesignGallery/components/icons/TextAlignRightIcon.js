import React from 'react'
import PropTypes from 'prop-types'

const TextAlignRightIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="2.25" width="13.5" height="1.5" />
    <rect x="6" y="5.25" width="10.5" height="1.5" />
    <rect x="1.5" y="8.25" width="15" height="1.5" />
    <path d="M6 11.25H16.5V12.75H6V11.25Z" />
    <rect x="3" y="14.25" width="13.5" height="1.5" />
  </svg>
)

TextAlignRightIcon.propTypes = {
  fill: PropTypes.string
}

export default TextAlignRightIcon
