import React from 'react'
import PropTypes from 'prop-types'

const AlignHEvenCenterIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9636 8.43638H16V6.40002H13.9636V4.36366L9.89091 7.4182L13.9636 10.4727V8.43638Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.47289 6.40001H0.436523L0.436523 8.43637H2.47289L2.47289 10.4727L6.54561 7.41819L2.47289 4.36365L2.47289 6.40001Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.30957 0.290926H7.27321L7.27321 14.5455H9.30957L9.30957 0.290926Z"
    />
  </svg>
)

AlignHEvenCenterIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignHEvenCenterIcon
