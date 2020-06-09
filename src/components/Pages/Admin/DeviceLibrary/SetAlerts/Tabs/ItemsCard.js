import React from 'react'
import { Grid, withStyles } from '@material-ui/core'
import { Card } from 'components/Card'

function styles({ type, palette }) {
  return {
    headerHelpText: {
      fontSize: '12px',
      lineHeight: '42px',
      color: '#9394a0',
      textAlign: 'right'
    },
    header: {
      paddingLeft: 0,
      border: `solid 1px ${palette[type].card.greyHeader.border}`,
      backgroundColor:
        palette[type].pages.devices.alerts.tabs.card.header.background
    },
    headerError: {
      borderColor: 'red'
    },
    headerText: {
      width: '100%',
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.header.titleColor
    },
    root: {
      maxHeight: 'calc((100% - 76px) / 2)',
      height: 'calc((100% - 76px) / 2)',
      paddingBottom: 20
    },
    container: {
      maxHeight: 'calc(100% - 64px)',
      overflowY: 'auto'
    }
  }
}

function ItemsCard({ classes, title, error, children }) {
  return (
    <Card
      grayHeader
      icon={false}
      shadow={false}
      radius={false}
      removeSidePaddings
      headerSidePaddings
      removeNegativeHeaderSideMargins
      title={title}
      headerHelpTextClasses={[classes.headerHelpText]}
      headerClasses={[classes.header, error ? classes.headerError : '']}
      headerTextClasses={[classes.headerText]}
      rootClassName={classes.root}
    >
      <Grid container className={classes.container}>
        {children}
      </Grid>
    </Card>
  )
}

export default withStyles(styles)(ItemsCard)
