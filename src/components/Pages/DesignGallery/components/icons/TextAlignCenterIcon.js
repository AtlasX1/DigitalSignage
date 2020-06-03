import React from 'react'
import PropTypes from 'prop-types'

const TextAlignCenterIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2.25" y="2.25" width="13.5" height="1.5" />
    <rect x="3.75" y="5.25" width="10.5" height="1.5" />
    <rect x="1.5" y="8.25" width="15" height="1.5" />
    <path d="M3.75 11.25H14.25V12.75H3.75V11.25Z" />
    <rect x="2.25" y="14.25" width="13.5" height="1.5" />
  </svg>
)

TextAlignCenterIcon.propTypes = {
  fill: PropTypes.string
}

export default TextAlignCenterIcon
