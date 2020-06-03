import React from 'react'
import PropTypes from 'prop-types'
import { Route, Link } from 'react-router-dom'
import { translate } from 'react-i18next'

import Slider from 'react-slick'
import { withStyles, Grid } from '@material-ui/core'

import { FormControlSelect } from '../../../Form'
import PageContainer from '../../../PageContainer'

import { TimelineTable } from './TimelineGrid'
import EditPlaybackContent from './EditPlaybackContent'
import { WhiteButton } from '../../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pages.schedule.timeline.header.icon
    },
    selectTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: palette[type].pages.schedule.timeline.title
    },
    selectSubTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].pages.schedule.timeline.title
    },
    pageContainerSubHeader: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: '65px'
    },
    formControlSelect: {
      minWidth: '120px',
      marginRight: '15px'
    },
    devicesList: {
      height: '100%',
      overflowY: 'auto'
    },
    actionButtonsContainer: {
      marginRight: 15
    },
    sliderContainer: {
      fontFamily: theme.typography.fontFamily,
      fontWeight: 'bold',
      maxWidth: '80px',
      textAlign: 'center',
      outline: 'none',

      '& .slick-prev:before': {
        color: palette[type].pageContainer.header.titleColor
      },
      '& .slick-next:before': {
        color: palette[type].pageContainer.header.titleColor
      }
    },
    sliderItem: {
      textAlign: 'center',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: palette[type].pageContainer.header.titleColor
    }
  }
}

const ScheduleTimeline = ({ t, classes }) => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'SEP',
    'OCT',
    'NOV',
    'DEC'
  ]

  return (
    <PageContainer
      pageTitle={t('Schedule Timeline')}
      ActionButtonsComponent={
        <Grid container className={classes.actionButtonsContainer}>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to="/schedule-timeline/edit"
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {t('Edit Content')}
          </WhiteButton>
        </Grid>
      }
      SubHeaderMiddleActionComponent={
        <div className={classes.sliderContainer}>
          <Slider {...sliderSettings}>
            {months.map(month => (
              <div
                className={classes.sliderItem}
                key={month}
              >{`${month} 2018`}</div>
            ))}
          </Slider>
        </div>
      }
      SubHeaderRightActionComponent={
        <FormControlSelect
          placeholder="24 Hours"
          options={[
            { value: 0, label: '24 Hours' },
            { value: 1, label: '12 Hours' }
          ]}
          formControlContainerClass={classes.formControlSelect}
          marginBottom={false}
        />
      }
      subHeaderRightActionComponentClassName={classes.pageContainerSubHeader}
    >
      <TimelineTable />

      <Route path="/schedule-timeline/edit" component={EditPlaybackContent} />
    </PageContainer>
  )
}

ScheduleTimeline.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(ScheduleTimeline))
