import { Typography, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { translate } from 'react-i18next'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import PageContainer from '../../PageContainer'
import ReportsSearchForm from './ReportsSearch'
import ReportsTable from './ReportsTable'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionIcons: {
      marginRight: '17px'
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    },
    selectTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    selectSubTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    }
  }
}

class ReportsLibrary extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: 0,
      selectedPeriod: props.t('Playback Reports Tab')
    }
  }

  handleChangeSelectionItems = value => {
    this.setState({ selected: value })
  }

  handleTabChanges = (event, selectedPeriod) =>
    this.setState({ selectedPeriod })

  render() {
    const { classes, t } = this.props
    const { selectedPeriod } = this.state

    return (
      <PageContainer
        pageTitle={t('Reports page title')}
        PageTitleComponent={
          this.state.selected > 0 ? (
            <div
              key="selectTitle"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography component="h2" className={classes.selectTitle}>
                {`${t('Reports page title')} |`}
              </Typography>
              {'\u00A0'}
              <Typography
                component="h3"
                variant="subtitle1"
                className={classes.selectSubTitle}
              >
                {`${this.state.selected} ${t('selected')}`}
              </Typography>
            </div>
          ) : null
        }
        MiddleActionComponent={
          <TabToggleButtonGroup
            value={selectedPeriod}
            exclusive
            onChange={this.handleTabChanges}
          >
            <TabToggleButton value={t('Playback Reports Tab')}>
              {t('Playback Reports Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Activity Reports Tab')}>
              {t('Activity Reports Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Users Reports Tab')}>
              {t('Users Reports Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Usage Reports Tab')}>
              {t('Usage Reports Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Feature Expiration Reports Tab')}>
              {t('Feature Expiration Reports Tab')}
            </TabToggleButton>
          </TabToggleButtonGroup>
        }
        ActionButtonsComponent={
          <Fragment>
            <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
              <i
                className={`${classes.iconColor} icon-navigation-show-more-vertical`}
              />
              {t('Export table action')}
            </WhiteButton>
            <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
              <i className={`${classes.iconColor} icon-folder-video`} />
              {t('Print table action')}
            </WhiteButton>
          </Fragment>
        }
        SubHeaderMenuComponent={<ReportsSearchForm />}
      >
        <ReportsTable onChangeSelection={this.handleChangeSelectionItems} />
      </PageContainer>
    )
  }
}

export default translate('translations')(withStyles(styles)(ReportsLibrary))
