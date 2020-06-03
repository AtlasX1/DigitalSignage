import React from 'react'
import PropTypes from 'prop-types'

const TextCapsIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.5 4.5H1.5C1.086 4.5 0.75 4.836 0.75 5.25V7.5H2.25V6H3.75V13.5H2.25V15H6.75V13.5H5.25V6H6.75V7.5H8.25V5.25C8.25 4.836 7.914 4.5 7.5 4.5Z" />
    <path d="M16.5 4.5H10.5C10.086 4.5 9.75 4.836 9.75 5.25V7.5H11.25V6H12.75V13.5H11.25V15H15.75V13.5H14.25V6H15.75V7.5H17.25V5.25C17.25 4.836 16.914 4.5 16.5 4.5Z" />
  </svg>
)

TextCapsIcon.propTypes = {
  fill: PropTypes.string
}

export default TextCapsIcon
