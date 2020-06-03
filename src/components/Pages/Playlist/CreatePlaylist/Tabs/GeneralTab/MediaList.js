import React from 'react'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from '../../../../../Card'
import MediaListItem from './MediaListItem'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => ({
  mediaListWrap: {
    padding: '13px 0 0 0',
    maxWidth: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '930px'
  }
})

const MediaList = ({ t, classes, media: mediaList }) => {
  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
    >
      <Grid container className={classes.mediaListWrap}>
        <Scrollbars style={{ height: '900px' }}>
          {mediaList.map((item, index) => (
            <MediaListItem
              key={`feature-${index}`}
              item={item}
              noBorder={index === mediaList.length - 1}
            />
          ))}
        </Scrollbars>
      </Grid>
    </Card>
  )
}

export default withStyles(styles)(MediaList)
