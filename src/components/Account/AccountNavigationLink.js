import React, { Component } from 'react'

import { CircleIconButton } from '../Buttons'

class AccountNavigationLink extends Component {
  state = {
    anchorEl: null
  }

  handleHover = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { linkIconClassName, handleClick } = this.props

    return (
      <div
        onClick={handleClick}
        onMouseOver={this.handleHover}
        onMouseLeave={this.handleClose}
      >
        <CircleIconButton className="hvr-grow">
          <i className={linkIconClassName} />
        </CircleIconButton>
      </div>
    )
  }
}

export default AccountNavigationLink
