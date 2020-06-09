import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import {
  Grid,
  Typography,
  withStyles,
  RootRef,
  Tooltip
} from '@material-ui/core'
import Popup from 'components/Popup'
import { CircleIconButton } from 'components/Buttons'
import ScheduleDetailsModal from 'components/Pages/Schedule/ScheduleDetailsModal'

import { isEven } from 'utils'
import { dndConstants } from 'constants/index'
import { truncateWithEllipsis } from 'utils/truncateStringUtils'

const styles = theme => {
  const { palette, type } = theme
  return {
    scheduleIconWrap: {
      marginRight: '15px',
      lineHeight: '40px',
      color: '#0a83c8'
    },
    detailRow: {
      marginRight: '20px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    detailLabel: {
      lineHeight: '40px',
      color: '#74809a'
    }
  }
}

const ScheduleItem = ({ classes, schedule, index }) => {
  const [dropdown, setDropdown] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.scheduleGroupsItemTypes.SCHEDULE_ITEM,
      id: schedule.id
    },
    canDrag: () => !dropdown,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={drag}>
      <Grid item xs={5} style={{ opacity }}>
        <Grid container alignItems="center">
          <Grid item className={classes.scheduleIconWrap}>
            <i className="icon-computer-screen-1" />
          </Grid>
          <Grid item xs className={classes.detailRow}>
            <Tooltip title={schedule.title}>
              <Typography className={classes.detailLabel}>
                {truncateWithEllipsis(schedule.title, 30)}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            <Popup
              position={isEven(index) ? 'bottom center' : 'bottom right'}
              onOpen={() => setDropdown(true)}
              onClose={() => setDropdown(false)}
              trigger={
                <CircleIconButton className={classes.moreIcon}>
                  <i className="icon-navigation-show-more-vertical" />
                </CircleIconButton>
              }
              contentStyle={{
                padding: '0',
                borderRadius: '6px',
                width: '300px'
              }}
            >
              <ScheduleDetailsModal schedule={schedule} />
            </Popup>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

export default withStyles(styles)(ScheduleItem)
