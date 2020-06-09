import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import MediaThemeSelector from '../MediaThemeSelector'
import { MediaInfo, MediaTabActions } from '../../Media'

import ExpansionPanel from '../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import { CurrencySelector } from './components'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#0A83C8'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const InfoMessageStyles = ({ typography }) => ({
  infoMessageContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0 16px'
  },
  infoMessage: {
    marginLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>Base Currency is USD</div>
    </div>
  )
)

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '15px 30px'
    },
    expansionPanelLabelClass: {
      fontSize: '12px',
      color: palette[type].pages.media.premium.color,
      fontWeight: '700'
    },
    mediaInfoContainer: {
      height: '100%'
    },
    tabContent: {
      height: '100%'
    },
    mediaInfoWrap: {
      borderLeft: 'solid 1px #e4e9f3'
    }
  }
}

class CurrencyExchange extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currenciesList: [
        {
          label: 'BRA',
          icon: 'icon-cog-play'
        },
        {
          label: 'CAD',
          icon: 'icon-cog-play'
        },
        {
          label: 'CNY',
          icon: 'icon-cog-play'
        },
        {
          label: 'EUR',
          icon: 'icon-cog-play'
        },
        {
          label: 'HKD',
          icon: 'icon-cog-play'
        },
        {
          label: 'INR',
          icon: 'icon-cog-play'
        },
        {
          label: 'KRW',
          icon: 'icon-cog-play'
        },
        {
          label: 'GBP',
          icon: 'icon-cog-play'
        },
        {
          label: 'MXN',
          icon: 'icon-cog-play'
        },
        {
          label: 'JPY',
          icon: 'icon-cog-play'
        },
        {
          label: 'NOK',
          icon: 'icon-cog-play'
        }
      ],
      selectedCurrenciesList: [],
      selectedThemeType: 'Modern'
    }
  }

  handleThemeTypeChanges = (event, selectedThemeType) =>
    this.setState({ selectedThemeType })

  handleSwipeRight = index => {
    const { currenciesList, selectedCurrenciesList } = this.state

    const replacedElement = currenciesList.splice(index, 1)
    const newSelectedCurrenciesList = selectedCurrenciesList.concat(
      replacedElement
    )

    this.setState({
      currenciesList,
      selectedCurrenciesList: newSelectedCurrenciesList
    })
  }

  handleSwipeLeft = index => {
    const { currenciesList, selectedCurrenciesList } = this.state

    const replacedElement = selectedCurrenciesList.splice(index, 1)
    const newCurrenciesList = currenciesList.concat(replacedElement)

    this.setState({
      currenciesList: newCurrenciesList,
      selectedCurrenciesList
    })
  }

  render() {
    const { classes } = this.props
    const {
      currenciesList,
      selectedCurrenciesList,
      selectedThemeType
    } = this.state

    return (
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="space-between">
              <Grid item xs={12}>
                <ExpansionPanel
                  expanded={false}
                  title={'Theme'}
                  formControlLabelClass={classes.expansionPanelLabelClass}
                  children={
                    <Grid container justify="center">
                      <MediaThemeSelector
                        value={selectedThemeType}
                        onChange={this.handleThemeTypeChanges}
                      />
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={true}
                  title={'Currency Selector'}
                  formControlLabelClass={classes.expansionPanelLabelClass}
                  children={
                    <Grid container justify="center">
                      <Grid item xs={12}>
                        <CurrencySelector
                          currenciesList={currenciesList}
                          selectedCurrenciesList={selectedCurrenciesList}
                          handleSwipeRight={this.handleSwipeRight}
                          handleSwipeLeft={this.handleSwipeLeft}
                        />
                      </Grid>
                    </Grid>
                  }
                />
                <ExpansionPanel
                  expanded={false}
                  title={'Apply Buy and Sell'}
                  formControlLabelClass={classes.expansionPanelLabelClass}
                  children={
                    <Grid container>
                      <Grid item xs={12}></Grid>
                    </Grid>
                  }
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={5} className={classes.mediaInfoWrap}>
          <Grid
            container
            direction="column"
            justify="space-between"
            className={classes.mediaInfoContainer}
          >
            <Grid item>
              <MediaInfo />
            </Grid>
            <Grid item>
              <MediaTabActions />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default translate('translations')(withStyles(styles)(CurrencyExchange))
