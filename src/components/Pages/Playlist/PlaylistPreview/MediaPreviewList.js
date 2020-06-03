import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography, Checkbox } from '@material-ui/core'

import { Card } from '../../../Card'
import { TableLibraryRowActionButton } from '../../../TableLibrary'
import LibraryTypeIcon from '../../../LibraryTypeIcon'

const styles = theme => ({
  header: {
    paddingLeft: 0,
    border: 'solid 1px #e4e9f3',
    backgroundColor: '#f5f6fa',
    marginBottom: '5px'
  },
  headerText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: '#0f2147'
  },
  mediaItem: {
    padding: '15px 0',

    '&:not(:last-child)': {
      borderBottom: '1px solid #e4e9f3'
    }
  },
  mediaCheck: {
    marginRight: '20px',
    paddingTop: '5px'
  },
  typeIconWrap: {
    textAlign: 'center',
    marginRight: '25px'
  },
  mediaTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '36px',
    color: '#040d37'
  },
  rightSide: {
    textAlign: 'right'
  },
  mediaDuration: {
    fontSize: '14px',
    lineHeight: '18px',
    color: '#040d37'
  },
  mediaResolution: {
    lineHeight: '18px',
    color: '#9394a0'
  },
  mediaItemAction: {
    marginLeft: '20px'
  }
})

class MediaPreviewList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: []
    }
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  render() {
    const { t, classes, media: mediaList } = this.props

    return (
      <Card
        icon={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        removeSidePaddings={true}
        headerSidePaddings={true}
        removeNegativeHeaderSideMargins={true}
        title={t('Media').toUpperCase()}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerText]}
      >
        <Grid container>
          {mediaList.map((media, index) => {
            const isSelected = this.isSelected(media.id)
            return (
              <Grid
                item
                xs={12}
                key={`feature-${index}`}
                className={classes.mediaItem}
              >
                <Grid container justify="space-between">
                  <Grid item xs={6}>
                    <Grid container>
                      <Grid
                        item
                        onClick={event => this.handleClick(event, media.id)}
                        className={classes.mediaCheck}
                      >
                        <Checkbox checked={isSelected} />
                      </Grid>
                      <Grid item>
                        <LibraryTypeIcon
                          type={media.type}
                          wrapHelperClass={classes.typeIconWrap}
                        />
                      </Grid>
                      <Grid item>
                        <Typography className={classes.mediaTitle}>
                          {media.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} className={classes.rightSide}>
                    <Grid container justify="flex-end">
                      <Grid item>
                        <Typography className={classes.mediaDuration}>
                          {media.duration}
                        </Typography>
                        <Typography className={classes.mediaResolution}>
                          {media.resolution}
                        </Typography>
                      </Grid>
                      <Grid item className={classes.mediaItemAction}>
                        <TableLibraryRowActionButton
                          actionLinks={[
                            {
                              label: t('Add to Playlist Media action'),
                              clickAction: f => f
                            },
                            { label: t('Edit action'), clickAction: f => f },
                            { divider: true },
                            {
                              label: t('Delete Media action'),
                              icon: 'icon-bin',
                              clickAction: f => f
                            }
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      </Card>
    )
  }
}

export default translate('translations')(withStyles(styles)(MediaPreviewList))
