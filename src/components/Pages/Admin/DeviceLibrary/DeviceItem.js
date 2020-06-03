import React from 'react'
import { useDrag } from 'react-dnd'

import { Grid, Typography, withStyles, RootRef } from '@material-ui/core'
import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    deviceItem: {
      paddingRight: '20px'
    },
    deviceHoverWrap: {
      '&:hover': {
        background: 'rgba(230, 234, 244, 0.15)',
        color: '#0a83c8 !important'
      }
    },
    deviceIconWrap: {
      height: '24px',
      marginRight: '15px',
      marginLeft: '10px',
      color: '#0a83c8'
    },
    detailRow: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    detailLabel: {
      lineHeight: '40px',
      color: palette[type].pages.devices.groups.item.color
    }
  }
}

const DeviceItem = ({ classes, device }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.deviceGroupsItemTypes.DEVICE_ITEM,
      id: device.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={drag}>
      <Grid item xs={5} style={{ opacity }}>
        <Grid container alignItems="center" className={classes.deviceItem}>
          <Grid item xs={12} className={classes.deviceHoverWrap}>
            <Grid container alignItems="center">
              <Grid item className={classes.deviceIconWrap}>
                <i className="icon-computer-screen-1" />
              </Grid>
              <Grid item xs className={classes.detailRow}>
                <Typography className={classes.detailLabel}>
                  {device.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

export default withStyles(styles)(DeviceItem)
