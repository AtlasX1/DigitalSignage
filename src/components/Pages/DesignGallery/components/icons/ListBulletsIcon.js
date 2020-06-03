import React from 'react'
import PropTypes from 'prop-types'

const ListBulletsIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.25 1.5H5.25C5.66475 1.5 6 1.836 6 2.25V5.25C6 5.664 5.66475 6 5.25 6H2.25C1.836 6 1.5 5.664 1.5 5.25V2.25C1.5 1.836 1.836 1.5 2.25 1.5ZM3 4.5H4.5V3H3V4.5Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.25 6.75H5.25C5.66475 6.75 6 7.086 6 7.5V10.5C6 10.914 5.66475 11.25 5.25 11.25H2.25C1.836 11.25 1.5 10.914 1.5 10.5V7.5C1.5 7.086 1.836 6.75 2.25 6.75ZM3 9.75H4.5V8.25H3V9.75Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.25 12H5.25C5.66475 12 6 12.336 6 12.75V15.75C6 16.164 5.66475 16.5 5.25 16.5H2.25C1.836 16.5 1.5 16.164 1.5 15.75V12.75C1.5 12.336 1.836 12 2.25 12ZM3 15H4.5V13.5H3V15Z"
    />
    <rect x="7.5" y="3" width="9" height="1.5" />
    <rect x="7.5" y="8.25" width="9" height="1.5" />
    <path d="M7.5 13.5H16.5V15H7.5V13.5Z" />
  </svg>
)

ListBulletsIcon.propTypes = {
  fill: PropTypes.string
}

export default ListBulletsIcon
