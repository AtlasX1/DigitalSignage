import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'
import { WhiteButton, BlueButton } from 'components/Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    bottomActionsContainer: {
      background: palette[type].pages.createTemplate.footer.background,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 28px'
    },
    button: {
      marginRight: '18px',
      '&:last-child': {
        marginRight: '0'
      }
    }
  }
}

const BottomActions = ({
  t,
  classes,
  rootClass = '',
  onSave = f => f,
  onCancel = f => f
}) => (
  <Grid className={[classes.bottomActionsContainer, rootClass].join(' ')}>
    <Grid>
      <WhiteButton classes={{ root: classes.button }}>
        {t('Preview')}
      </WhiteButton>
      <WhiteButton classes={{ root: classes.button }}>
        {t('Clear All Zones')}
      </WhiteButton>
    </Grid>
    <Grid>
      <BlueButton classes={{ root: classes.button }} onClick={onSave}>
        {t('Save Template')}
      </BlueButton>
      <WhiteButton classes={{ root: classes.button }} onClick={onCancel}>
        {t('Cancel')}
      </WhiteButton>
    </Grid>
  </Grid>
)

export default translate('translations')(withStyles(styles)(BottomActions))
