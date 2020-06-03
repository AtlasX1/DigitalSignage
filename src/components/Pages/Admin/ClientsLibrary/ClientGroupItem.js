import React from 'react'
import { useDrag } from 'react-dnd'
import { Grid, Typography, withStyles, RootRef } from '@material-ui/core'

import { dndConstants } from '../../../../constants'

const styles = theme => {
  const { palette, type } = theme
  return {
    clientGroupItem: {
      paddingRight: '20px'
    },
    clientGroupItemHoverWrap: {
      '&:hover': {
        background: 'rgba(230, 234, 244, 0.15)',
        color: '#0a83c8 !important'
      }
    },
    clientGroupItemIconWrap: {
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

const ClientGroupItem = ({ classes, item }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.clientItemTypes.CLIENT_ITEM,
      id: item.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={drag}>
      <Grid item xs={6} style={{ opacity }}>
        <Grid container alignItems="center" className={classes.clientGroupItem}>
          <Grid item xs={12} className={classes.clientGroupItemHoverWrap}>
            <Grid container alignItems="center">
              <Grid item className={classes.clientGroupItemIconWrap}>
                <i className="icon-business-man" />
              </Grid>
              <Grid item xs className={classes.detailRow}>
                <Typography className={classes.detailLabel}>
                  {item.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

export default withStyles(styles)(ClientGroupItem)
