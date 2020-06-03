import React from 'react'
import PropTypes from 'prop-types'

const TextBoldIcon = ({ fill = 'currentColor' }) => (
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
      d="M11.005 7.03733C11.6183 6.43266 12.0003 5.594 12.0003 4.66666C12.0003 2.82866 10.505 1.33333 8.66699 1.33333H2.66699V2.66666H4.00033V13.3333H2.66699V14.6667H9.33366C11.5397 14.6667 13.3337 12.8727 13.3337 10.6667C13.3337 9.05799 12.377 7.672 11.005 7.03733ZM8.66699 2.66666C9.76966 2.66666 10.667 3.56399 10.667 4.66666C10.667 5.76933 9.76966 6.66666 8.66699 6.66666H5.33366V2.66666H8.66699ZM5.33366 13.3333H9.33366C10.8043 13.3333 12.0003 12.1373 12.0003 10.6667C12.0003 9.19599 10.8043 7.99999 9.33366 7.99999H5.33366V13.3333Z"
    />
  </svg>
)

TextBoldIcon.propTypes = {
  fill: PropTypes.string
}

export default TextBoldIcon
