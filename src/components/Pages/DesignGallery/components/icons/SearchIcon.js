import React from 'react'
import PropTypes from 'prop-types'

const SearchIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="24"
    height="24"
    fill={fill}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.025 15.611L22.707 21.293L21.293 22.707L15.611 17.025C14.07 18.258 12.121 19 10 19C5.037 19 1 14.962 1 10C1 5.038 5.037 1 10 1C14.963 1 19 5.038 19 10C19 12.122 18.258 14.071 17.025 15.611ZM3 10C3 13.86 6.141 17 10 17C13.859 17 17 13.86 17 10C17 6.14 13.859 3 10 3C6.141 3 3 6.14 3 10Z"
    />
  </svg>
)

SearchIcon.propTypes = {
  fill: PropTypes.string
}

export default SearchIcon
