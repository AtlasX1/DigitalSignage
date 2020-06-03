import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { FormControlInput } from '../../../Form'
import { Card } from '../../../Card'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      margin: '0 12px',
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].card.greyHeader.color
    },
    mediaInformationInputsWrap: {
      margin: '20px 0'
    },
    mediaInformationInput: {
      padding: '0 12px'
    }
  }
}

const PlaylistInformation = ({ t, classes }) => (
  <Card
    icon={false}
    grayHeader={true}
    shadow={false}
    radius={false}
    removeSidePaddings={true}
    headerSidePaddings={true}
    removeNegativeHeaderSideMargins={true}
    title={t('Playlist Information').toUpperCase()}
    headerClasses={[classes.header]}
    headerTextClasses={[classes.headerText]}
  >
    <Grid container className={classes.mediaInformationInputsWrap}>
      <Grid item xs={12} className={classes.mediaInformationInput}>
        <FormControlInput
          id="media-name-title"
          fullWidth={true}
          label={t('Name / Title')}
        />
      </Grid>
      <Grid item xs={6} className={classes.mediaInformationInput}>
        <FormControlInput
          id="media-description"
          fullWidth={true}
          label={t('Description')}
        />
      </Grid>
      <Grid item xs={6} className={classes.mediaInformationInput}>
        <FormControlInput
          id="media-create-add"
          fullWidth={true}
          label={t('Create New / Add to Group')}
        />
      </Grid>
      <Grid item xs={6} className={classes.mediaInformationInput}>
        <FormControlInput
          id="media-total-playtime"
          fullWidth={true}
          label={t('Total Playtime')}
        />
      </Grid>
      <Grid item xs={6} className={classes.mediaInformationInput}>
        <FormControlInput
          id="media-add-tags"
          fullWidth={true}
          label={t('Add Tags')}
        />
      </Grid>
    </Grid>
  </Card>
)

export default translate('translations')(
  withStyles(styles)(PlaylistInformation)
)
