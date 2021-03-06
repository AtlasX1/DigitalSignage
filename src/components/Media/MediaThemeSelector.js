import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { withStyles, Grid } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../Buttons'

import MediaHtmlCarousel from './MediaHtmlCarousel'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      fontFamily: typography.fontFamily
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.background,
      borderRadius: '4px'
    },
    tabToggleButton: {
      width: '128px'
    },
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent'
    },
    marginTop: {
      marginTop: 16
    }
  }
}

const MediaThemeSelector = ({ t, classes, value, onChange, carousel }) => (
  <Grid item xs={12} className={classes.themeCardWrap}>
    <TabToggleButtonGroup
      className={classNames(
        classes.tabToggleButtonContainer,
        classes.marginTop
      )}
      value={value}
      onChange={onChange}
      exclusive
    >
      <TabToggleButton className={classes.tabToggleButton} value={'Modern'}>
        {t('Modern Theme')}
      </TabToggleButton>
      <TabToggleButton className={classes.tabToggleButton} value={'Legacy'}>
        {t('Legacy Theme')}
      </TabToggleButton>
    </TabToggleButtonGroup>
    <Grid container className={classes.marginTop}>
      <Grid item xs={12}>
        <MediaHtmlCarousel {...carousel} />
      </Grid>
    </Grid>
  </Grid>
)

MediaThemeSelector.propTypes = {
  value: PropTypes.oneOf(['Modern', 'Legacy']).isRequired,
  onChange: PropTypes.func.isRequired,
  carousel: PropTypes.object
}

MediaThemeSelector.defaultProps = {
  carousel: {}
}

export default translate('translations')(withStyles(styles)(MediaThemeSelector))
