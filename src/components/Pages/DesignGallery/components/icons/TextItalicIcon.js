import React from 'react'
import PropTypes from 'prop-types'

const TextItalicIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2.66666V1.33333H7.33333V2.66666H9.64067L4.90067 13.3333H2V14.6667H8.66667V13.3333H6.35933L11.0993 2.66666H14Z" />
  </svg>
)

TextItalicIcon.propTypes = {
  fill: PropTypes.string
}

export default TextItalicIcon
