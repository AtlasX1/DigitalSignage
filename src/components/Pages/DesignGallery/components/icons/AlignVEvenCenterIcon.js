import React from 'react'
import PropTypes from 'prop-types'

const AlignVEvenCenterIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.16383 2.3091V0.272736L6.12747 0.272736V2.3091L4.0911 2.3091L7.14565 6.38183L10.2002 2.3091L8.16383 2.3091Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.12718 13.8V15.8364H8.16355V13.8H10.1999L7.14537 9.72727L4.09082 13.8H6.12718Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.0179157 6.96365V9.00002L14.2725 9.00002V6.96365L0.0179157 6.96365Z"
    />
  </svg>
)

AlignVEvenCenterIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignVEvenCenterIcon
