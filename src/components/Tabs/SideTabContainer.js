import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

const styles = theme => ({})

class SideTabContainer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <header className={classes.tabHeader} />
        <Grid container />
      </div>
    )
  }
}

export default withStyles(styles)(SideTabContainer)
