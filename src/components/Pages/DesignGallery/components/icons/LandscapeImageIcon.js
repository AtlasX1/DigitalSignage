import React from 'react'
import PropTypes from 'prop-types'

const LandscapeImageIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.33341 4.33334H18.8652L23.8334 9.30151V19.5C23.8334 20.6949 22.8617 21.6667 21.6667 21.6667H4.33341C3.1385 21.6667 2.16675 20.6949 2.16675 19.5V6.50001C2.16675 5.30618 3.1385 4.33334 4.33341 4.33334ZM4.33341 6.50001V19.5H21.6678L21.6667 10.8333H17.3334V6.50001H4.33341Z"
    />
    <path d="M10.8398 15.6813L9.18558 13.0249L6.5 17.3333H19.5L14.6553 9.56259L10.8398 15.6813Z" />
  </svg>
)

LandscapeImageIcon.propTypes = {
  fill: PropTypes.string
}

export default LandscapeImageIcon
