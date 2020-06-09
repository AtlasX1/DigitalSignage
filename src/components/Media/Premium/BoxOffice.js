import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { WhiteButton } from '../../Buttons'

import {
  SliderInputRange,
  FormControlSelect,
  FormControlInput
} from '../../Form'

import MediaThemeSelector from '../MediaThemeSelector'
import { MediaInfo, MediaTabActions } from '../../Media'

import ExpansionPanel from '../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', color = '', classes }) => (
    <div className={classes.tabIconWrap} style={{ color: color }}>
      <i className={iconClassName} />
    </div>
  )
)

const InfoMessageStyles = ({ typography }) => ({
  infoMessageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
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
      <TabIcon iconClassName={iconClassName} color="#0A83C8" />
      <div className={classes.infoMessage}>
        Modern transition effects require up to date device hardware, as well as
        up to date firmware on your device. Legacy transition effects are no
        longer supported.
      </div>
    </div>
  )
)

const styles = theme => {
  const { palette, type, formControls, typography } = theme
  return {
    root: {
      margin: '15px 30px 0'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaRow: {
      marginTop: 45
    },
    previewMediaText: {
      ...typography.lightText[type]
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px'
    },
    formControlRootClass: {
      marginBottom: 0
    },
    marginTop: {
      marginTop: 16
    },
    expansionPanelLabelClass: {
      fontSize: '12px',
      color: palette[type].pages.media.premium.color,
      fontWeight: '700'
    },
    sliderInputLabel: {
      ...formControls.mediaApps.refreshEverySlider.label,
      lineHeight: '15px',
      marginRight: '15px'
    },
    detailsButton: {
      height: '28px',
      width: '28px',
      minWidth: 'unset',
      padding: 0,
      display: 'block'
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

class BoxOffice extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedThemeType: 'Modern'
    }
  }

  handleThemeTypeChanges = (event, selectedThemeType) =>
    this.setState({ selectedThemeType })

  render() {
    const { t, classes } = this.props
    const { selectedThemeType } = this.state

    return (
      <Grid container className={classes.tabContent}>
        <Grid item xs={7}>
          <div className={classes.root}>
            <InfoMessage iconClassName={'icon-interface-information-1'} />
            <Grid container justify="space-between">
              <Grid item xs={12}>
                <ExpansionPanel
                  expanded={true}
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
                  expanded={false}
                  title={'Movie'}
                  formControlLabelClass={classes.expansionPanelLabelClass}
                  children={
                    <Grid container>
                      <Grid item xs={12}></Grid>
                    </Grid>
                  }
                />
              </Grid>
            </Grid>
            <Grid container className={classes.marginTop}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  spacing={16}
                >
                  <Grid item xs={6}>
                    <FormControlSelect marginBottom={false} />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControlInput
                      formControlRootClass={classes.formControlRootClass}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justify="center">
                      <Grid item>
                        <WhiteButton className={classes.detailsButton}>
                          <TabIcon iconClassName="icon-cog-play" />
                        </WhiteButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.marginTop}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  spacing={16}
                >
                  <Grid item xs={6}>
                    <FormControlSelect marginBottom={false} />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControlInput
                      formControlRootClass={classes.formControlRootClass}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justify="center">
                      <Grid item>
                        <WhiteButton className={classes.detailsButton}>
                          <TabIcon iconClassName="icon-cog-play" />
                        </WhiteButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.marginTop}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  spacing={16}
                >
                  <Grid item xs={6}>
                    <FormControlSelect marginBottom={false} />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControlInput
                      formControlRootClass={classes.formControlRootClass}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justify="center">
                      <Grid item>
                        <WhiteButton className={classes.detailsButton}>
                          <TabIcon iconClassName="icon-cog-play" />
                        </WhiteButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.marginTop}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-between"
                  spacing={16}
                >
                  <Grid item xs={6}>
                    <FormControlSelect marginBottom={false} />
                  </Grid>
                  <Grid item xs={5}>
                    <FormControlInput
                      formControlRootClass={classes.formControlRootClass}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Grid container justify="center">
                      <Grid item>
                        <WhiteButton className={classes.detailsButton}>
                          <TabIcon iconClassName="icon-cog-play" />
                        </WhiteButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.previewMediaRow}
            >
              <Grid item>
                <WhiteButton className={classes.previewMediaBtn}>
                  <Typography className={classes.previewMediaText}>
                    {t('Preview Media')}
                  </Typography>
                </WhiteButton>
              </Grid>
              <Grid item>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.sliderInputLabel}>
                      Refresh Every
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SliderInputRange
                      step={1}
                      value={5}
                      label={''}
                      maxValue={150}
                      minValue={0}
                      handleChange={() => {}}
                      numberWraperStyles={{ width: 55 }}
                      inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                    />
                  </Grid>
                </Grid>
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

export default translate('translations')(withStyles(styles)(BoxOffice))
