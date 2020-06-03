import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'
import { FormControlSelect } from '../../../../Form'
import { DropdownHover } from '../../../../Dropdowns'
import { CircleIconButton } from '../../../../Buttons'
import { TimelineCell } from '.'

const styles = theme => {
  const { palette, type } = theme
  return {
    slot: {
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].pages.schedule.timeline.border,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pages.schedule.timeline.border,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '48px',
      width: '60px'
    },
    slotWhite: {
      backgroundColor: 'white'
    },
    slotGrey: {
      backgroundColor: `${palette[type].pages.schedule.timeline.device.background} !important`
    },
    circleIcon: {
      color: palette[type].pages.schedule.timeline.icon
    },
    selectContainer: {
      paddingLeft: '5px',
      justifyContent: 'space-between !important'
    },
    select: {
      flex: 1
    },
    hours: {
      fontSize: 12,
      fontWeight: 'bold',
      justifyContent: 'flex-end !important',
      paddingRight: '5px'
    },
    gridFrame: {
      height: 48
    }
  }
}

const TimelineHeader = ({ t, classes, hours }) => {
  return (
    <Grid container item xs={12} className={classes.gridFrame}>
      <Grid container item alignContent="center" xs={2}>
        <TimelineCell
          timelineCellClassnames={[
            classes.slotGrey,
            classes.selectContainer
          ].join(' ')}
        >
          <FormControlSelect
            id="type"
            label={false}
            fullWidth={true}
            marginBottom={false}
            placeholder="Filter Devices"
            formControlContainerClass={classes.select}
            options={[{ value: '', disabled: true, label: '' }]}
          />
          <DropdownHover
            ButtonComponent={
              <CircleIconButton className={`hvr-grow ${classes.circleIcon}`}>
                <i className="icon-settings-1" />
              </CircleIconButton>
            }
            MenuComponent={<div />}
          />
        </TimelineCell>
      </Grid>
      <Grid container item alignContent="center" xs={10}>
        {hours.map((h, index) => (
          <TimelineCell
            key={index}
            timelineCellClassnames={[classes.hours, classes.slotGrey].join(' ')}
            header
          >
            {h}
          </TimelineCell>
        ))}
      </Grid>
    </Grid>
  )
}

TimelineHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  hours: PropTypes.array.isRequired
}

export default translate('translations')(withStyles(styles)(TimelineHeader))
