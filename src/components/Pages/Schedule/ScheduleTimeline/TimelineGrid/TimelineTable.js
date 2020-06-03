import React, { useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { withSnackbar } from 'notistack'
import { withStyles, Grid } from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import Popup from '../../../../Popup'
import { WhiteButton } from '../../../../Buttons'
import { TimelineHeader, TimelineCell } from '.'
import DeviceSettings from '../DeviceSettings'

import {
  getScheduleItemsAction,
  getScheduleLibraryPrefAction,
  putScheduleLibraryPrefAction
} from '../../../../../actions/scheduleActions'
import DeviceSchedule from '../DeviceSchedule'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      boxShadow: 'none',
      fontFamily: theme.typography.fontFamily,
      color: palette[type].header.account.color
    },
    table: {
      width: '100%',
      minHeight: '60vh'
    },
    slotGrey: {
      backgroundColor: `${palette[type].pages.schedule.timeline.device.background} !important`
    },
    circleIcon: {
      color: palette[type].pages.schedule.timeline.icon
    },
    selectContainer: {
      padding: '0 5px',
      justifyContent: 'space-between'
    },
    select: {
      flex: 1
    },
    devicesContainer: {
      justifyContent: 'space-between !important',
      padding: '0 12px 0 18px'
    },
    deviceActionBtn: {
      minWidth: '28px',
      width: '28px',
      height: '28px',
      padding: 0
    },
    deviceActionBtnIcon: {
      width: 18,
      height: 18
    },
    scheduleRow: {
      position: 'relative'
    },
    gridFrame: {
      height: 48
    },
    emptyCell: {
      borderBottom: 'none !important'
    }
  }
}

const dropdownStyle = {
  borderRadius: 6,
  width: 315,
  animation: 'fade-in 200ms'
}

const TimelineTable = ({
  t,
  classes,
  library,
  preference,
  getScheduleItemsAction,
  getScheduleLibraryPrefAction
}) => {
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({})
  const [emptyRows, setEmptyRows] = useState(0)

  const hours = [...Array(24).keys()]
    .map((h, i) => (i < 12 ? `${h + 1} AM` : `${h - 11} PM`))
    .map(h => (h === '12 AM' ? '12 PM' : h === '12 PM' ? '12 AM' : h))

  const devices = useMemo(() => {
    return [
      ...new Set(
        data.reduce((acc, schedule) => {
          return !schedule.deviceList ? acc : [...acc, ...schedule.deviceList]
        }, [])
      )
    ]
  }, [data])

  const mockData = [
    {
      title: 'When The Morning Dawns',
      startTime: '04:00:00',
      endTime: '19:00:00',
      deviceTitle: 'Device 2 in Germany'
    },
    {
      title: 'Content Title 2',
      startTime: '07:00:00',
      endTime: '21:00:00',
      deviceTitle: 'New Screen Loby'
    },
    {
      title: 'When The Morning Dawns',
      startTime: '14:00:00',
      endTime: '22:00:00',
      deviceTitle: 'Store Sales Floor'
    },
    {
      title: 'Content Title 3',
      startTime: '01:00:00',
      endTime: '13:00:00',
      deviceTitle: 'XVW4-546-003'
    },
    {
      title: 'When The Morning Dawns',
      startTime: '00:00:00',
      endTime: '15:00:00',
      deviceTitle: 'Device 2 in Germany'
    },
    {
      title: 'When The Morning Dawns',
      startTime: '17:00:00',
      endTime: '23:00:00',
      deviceTitle: 'New Screen Loby'
    },
    {
      title: 'Content Title 1',
      startTime: '12:00:00',
      endTime: '16:00:00',
      deviceTitle: 'Store Sales Floor'
    },
    {
      title: 'When The Morning Dawns',
      startTime: '17:00:00',
      endTime: '21:00:00',
      deviceTitle: 'XVW4-546-003'
    }
  ]

  const mockSchedule = mockData.map((schedule, i) => ({
    ...schedule,
    id: devices[i]
  }))

  useEffect(() => {
    getScheduleItemsAction()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!preference.response) {
      getScheduleLibraryPrefAction()
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (library.response) {
      setData(library.response)
      setMeta(library.meta)
    }

    //eslint-disable-next-line
  }, [library])

  useEffect(() => {
    handleEmptyRow(meta)
  }, [meta])

  const handleEmptyRow = ({ count }) => {
    const rowHeight = 48
    const tableHeight = window.innerHeight - 350
    const emptyRows = Math.ceil((tableHeight - 8 * rowHeight) / rowHeight)

    setEmptyRows(emptyRows)
  }

  return (
    <Grid container className={[classes.root, classes.table].join(' ')}>
      <TimelineHeader hours={hours} />
      {mockSchedule.map((schedule, index) => (
        <Grid container item xs={12} className={classes.gridFrame} key={index}>
          <Grid container item alignContent="center" xs={2}>
            <TimelineCell
              timelineCellClassnames={[
                classes.slotGrey,
                classes.devicesContainer
              ].join(' ')}
            >
              <>
                {schedule.deviceTitle}
                <div>
                  <Popup
                    position="bottom left"
                    contentStyle={dropdownStyle}
                    trigger={
                      <WhiteButton className={classes.deviceActionBtn}>
                        <Settings className={classes.deviceActionBtnIcon} />
                      </WhiteButton>
                    }
                  >
                    <DeviceSettings />
                  </Popup>
                </div>
              </>
            </TimelineCell>
          </Grid>
          <Grid
            container
            item
            alignContent="center"
            xs={10}
            className={classes.scheduleRow}
          >
            {hours.map((h, i) => {
              return <TimelineCell key={i} />
            })}
            <DeviceSchedule schedule={schedule} />
          </Grid>
        </Grid>
      ))}
      {emptyRows > 0 &&
        [...Array(emptyRows).keys()].map(key => (
          <Grid
            container
            item
            xs={12}
            className={classes.gridFrame}
            style={{ height: 48 }}
            key={key}
          >
            <Grid container item alignContent="center" xs={2}>
              <TimelineCell
                timelineCellClassnames={[
                  classes.slotGrey,
                  classes.emptyCell
                ].join(' ')}
              />
            </Grid>
            <Grid container item alignContent="center" xs={10}>
              {hours.map((h, i) => (
                <TimelineCell
                  key={i}
                  timelineCellClassnames={[classes.emptyCell].join(' ')}
                />
              ))}
            </Grid>
          </Grid>
        ))}
    </Grid>
  )
}

TimelineTable.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ schedule }) => ({
  library: schedule.library,
  preference: schedule.preference
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getScheduleItemsAction,
      getScheduleLibraryPrefAction,
      putScheduleLibraryPrefAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(TimelineTable))
  )
)
