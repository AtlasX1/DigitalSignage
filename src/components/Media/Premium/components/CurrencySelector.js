import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { TransparentButton } from '../../../Buttons'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',

    '& i:before': {
      display: 'block'
    }
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const styles = theme => {
  const { palette, type } = theme
  return {
    currencyConverterContainer: {
      display: 'flex',
      flexFlow: 'row nowrap'
    },
    converterSide: {
      flex: '100px 1 1',
      height: '362px',
      border: `1px solid ${palette[type].sideModal.content.border}`,
      overflowY: 'auto'
    },
    centralGap: {
      flex: '56px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette[type].pages.media.premium.currency.background
    },
    currencyItemContainer: {
      padding: '10px 16px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
      cursor: 'pointer'
    },
    currencyItemLabelContainer: {
      paddingLeft: '20px'
    },
    currencyItemLabel: {
      color: '#74809A',
      fontSize: '13px',
      userSelect: 'none'
    },
    deleteButton: {
      height: '19px',
      width: '19px',
      minWidth: 'unset',
      padding: 0
    }
  }
}

const CurrencySelector = ({ classes, ...props }) => {
  const {
    currenciesList,
    selectedCurrenciesList,
    handleSwipeRight,
    handleSwipeLeft
  } = props

  return (
    <div className={classes.currencyConverterContainer}>
      <div className={classes.converterSide}>
        {currenciesList.map((item, index) => (
          <Grid
            key={index}
            container
            alignItems="center"
            className={classes.currencyItemContainer}
            onClick={() => handleSwipeRight(index)}
          >
            <Grid item>
              <TabIcon iconClassName={item.icon} />
            </Grid>
            <Grid item className={classes.currencyItemLabelContainer}>
              <Typography className={classes.currencyItemLabel}>
                {item.label}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </div>
      <div className={classes.centralGap}>
        <TabIcon iconClassName={'icon-cog-play'} />
      </div>
      <div className={classes.converterSide}>
        {selectedCurrenciesList.map((item, index) => (
          <Grid
            key={index}
            container
            alignItems="center"
            justify="space-between"
            className={classes.currencyItemContainer}
            onClick={() => handleSwipeLeft(index)}
          >
            <Grid item>
              <Grid container>
                <Grid item>
                  <TabIcon iconClassName={item.icon} />
                </Grid>
                <Grid item className={classes.currencyItemLabelContainer}>
                  <Typography className={classes.currencyItemLabel}>
                    {item.label}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TransparentButton className={classes.deleteButton}>
                <TabIcon iconClassName="icon-bin" />
              </TransparentButton>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(CurrencySelector))
