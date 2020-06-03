import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core'
import {
  KeyboardArrowDown as ArrowDownIcon,
  Settings as SettingsIcon
} from '@material-ui/icons'

import Popup from '../../../Popup'

import ChartSettingsPopup from './ChartSettingsPopup'

import { WhiteButton } from '../../../Buttons'

const styles = {
  icon: {
    width: 16
  },
  iconSettings: {
    width: 18
  },
  iconMarginRight: {
    marginRight: 5
  },
  settingsButton: {
    position: 'absolute',
    top: 11,
    right: 16,
    zIndex: 11
  }
}

const contentStyle = {
  width: 291,
  borderRadius: 8,
  padding: 0,
  zIndex: 1111
}

const ChartSettingsButton = ({ classes, chart, setChart }) => (
  <Popup
    position="bottom right"
    contentStyle={contentStyle}
    trigger={
      <WhiteButton
        classes={{
          root: classes.settingsButton
        }}
      >
        <SettingsIcon
          className={[classes.icon, classes.iconMarginRight].join(' ')}
        />
        <ArrowDownIcon className={classes.iconSettings} />
      </WhiteButton>
    }
  >
    <ChartSettingsPopup chart={chart} setChart={setChart} />
  </Popup>
)

ChartSettingsButton.propTypes = {
  classes: PropTypes.object,
  chart: PropTypes.string,
  setChart: PropTypes.func
}

export default withStyles(styles)(ChartSettingsButton)
