import React from 'react'
import { translate } from 'react-i18next'

import { Grid, Typography, withStyles } from '@material-ui/core'
import { Info } from '@material-ui/icons'

const images = {
  standardBehaviour: require('../../../../../../../common/assets/images/zoom_to_fit_1.png'),
  zoomedBehaviour: require('../../../../../../../common/assets/images/zoom_to_fit_2.png')
}

const styles = theme => {
  const { palette, type } = theme
  return {
    labelContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    labelIcon: {
      width: '30px',
      height: '30px',
      color: '#0983c7',
      marginRight: '14px'
    },
    labelText: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: palette[type].pages.createTemplate.zoomToFit.color
    },
    itemContainer: {
      paddingTop: '15px',
      display: 'flex',
      flexDirection: 'column'
    },
    itemFirst: {
      paddingRight: '15px'
    },
    itemSecond: {
      paddingLeft: '15px'
    },
    itemLabel: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#818ca4'
    },
    itemText: {
      fontSize: '12px',
      whiteSpace: 'wrap',
      color: '#818ca4'
    },
    itemImage: {
      height: '117px',
      marginBottom: '10px'
    },
    standardBehImage: {
      width: '138px'
    },
    zoomedBehImage: {
      width: '192px'
    }
  }
}

const ZoomToFit = ({ classes, t }) => (
  <Grid container>
    <Grid item xs={12} className={classes.labelContainer}>
      <Info className={classes.labelIcon} />
      <Typography className={classes.labelText}>{t('Zoom to Fit')}</Typography>
    </Grid>
    <Grid
      item
      xs={6}
      className={[classes.itemContainer, classes.itemFirst].join(' ')}
    >
      <img
        src={images.standardBehaviour}
        alt="Standard Behaviour"
        className={[classes.itemImage, classes.standardBehImage].join(' ')}
      />
      <Typography className={classes.itemLabel}>
        {t('Standard Behaviour')}
      </Typography>
      <Typography className={classes.itemText}>
        {t('Zoom to Fit default behavior text')}
      </Typography>
    </Grid>
    <Grid
      item
      xs={6}
      className={[classes.itemContainer, classes.itemSecond].join(' ')}
    >
      <img
        src={images.zoomedBehaviour}
        alt="Zoomed Behaviour"
        className={[classes.itemImage, classes.zoomedBehImage].join(' ')}
      />
      <Typography className={classes.itemLabel}>{t('Zoom to Fit')}</Typography>
      <Typography className={classes.itemText}>
        {t('Zoom to Fit zoomed behavior text')}
      </Typography>
    </Grid>
  </Grid>
)

export default translate('translations')(withStyles(styles)(ZoomToFit))
