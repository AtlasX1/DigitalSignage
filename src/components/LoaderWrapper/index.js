import PropTypes from 'prop-types'

const LoaderWrapper = ({ isLoading, loader, children }) =>
  isLoading ? loader : children

LoaderWrapper.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loader: PropTypes.node.isRequired
}

export default LoaderWrapper
