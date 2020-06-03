import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import Card from './Card'

import { minTwoDigits } from '../../utils'

const styles = () => ({
  coloredBox: {
    width: '125px',
    padding: '10px 0 15px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '6px'
  },
  coloredBoxActiveOrange: {
    backgroundImage: 'linear-gradient(to bottom, #f29813, #ffb546)'
  },
  coloredBoxActiveBlue: {
    backgroundImage: 'linear-gradient(to bottom, #2981b8, #4e9ed1)'
  },
  coloredBoxActivePurple: {
    backgroundImage: 'linear-gradient(to bottom, #af7cc3, #c890de)'
  },
  coloredBoxInactive: {
    backgroundImage: 'linear-gradient(to bottom, #b7bdcb, #74809a)'
  },

  cardBoxesLabel: {
    fontWeight: 'bold',
    color: '#fff'
  },
  cardCount: {
    fontSize: '36px'
  },
  cardLabel: {
    fontSize: '13px',
    textTransform: 'uppercase'
  },
  menuContainer: {
    whiteSpace: 'nowrap'
  }
})

const ColoredBoxCard = ({ t, classes, ...props }) => {
  const {
    cardTitle = '',
    cardMenuItems = [],
    activeBoxColor = '',
    activeBoxCount,
    inActiveBoxCount,
    cardRootClassName = ''
  } = props

  const getActiveBoxColor = color => {
    switch (color) {
      case 'orange':
        return classes.coloredBoxActiveOrange
      case 'purple':
        return classes.coloredBoxActivePurple
      case 'blue':
      default:
        return classes.coloredBoxActiveBlue
    }
  }

  return (
    <Card
      showMenuOnHover
      title={cardTitle}
      menuItems={cardMenuItems}
      rootClassName={cardRootClassName}
      menuDropdownContainerClassName={classes.menuContainer}
    >
      <Grid container justify="space-between">
        <Grid
          item
          className={`${classes.coloredBox} ${getActiveBoxColor(
            activeBoxColor
          )}`}
        >
          <Typography
            className={`${classes.cardBoxesLabel} ${classes.cardCount}`}
          >
            {minTwoDigits(activeBoxCount)}
          </Typography>
          <Typography
            className={`${classes.cardBoxesLabel} ${classes.cardLabel}`}
          >
            {t('Active')}
          </Typography>
        </Grid>
        <Grid
          item
          className={`${classes.coloredBox} ${classes.coloredBoxInactive}`}
        >
          <Typography
            className={`${classes.cardBoxesLabel} ${classes.cardCount}`}
          >
            {minTwoDigits(inActiveBoxCount)}
          </Typography>
          <Typography
            className={`${classes.cardBoxesLabel} ${classes.cardLabel}`}
          >
            {t('Inactive')}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(ColoredBoxCard))
