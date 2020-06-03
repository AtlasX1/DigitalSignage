import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from '../../../Card'
import { FormControlSelect } from '../../../Form'
import { DropdownHover } from '../../../Dropdowns'
import { CircleIconButton } from '../../../Buttons'
import MediaListItem from './MediaListItem'

const styles = theme => ({
  mediaListWrap: {
    padding: '13px 20px 0 0'
  },
  circleIcon: {
    margin: '0 10px',
    padding: '7px',
    color: '#afb7c7'
  }
})

class MediaList extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { t, classes, media: mediaList } = this.props

    const typeOptions = [
      { value: '', disabled: true, label: t('Media Type Placeholder') }
    ]

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
        <Grid container alignContent="center">
          <Grid item xs>
            <FormControlSelect
              id="type"
              label={false}
              fullWidth={true}
              marginBottom={false}
              options={typeOptions}
            />
          </Grid>
          <Grid item>
            <DropdownHover
              ButtonComponent={
                <CircleIconButton className={`hvr-grow ${classes.circleIcon}`}>
                  <i className="icon-settings-1" />
                </CircleIconButton>
              }
              MenuComponent={<div />}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.mediaListWrap}>
          {mediaList.map((media, index) => (
            <MediaListItem key={`feature-${index}`} media={media} />
          ))}
        </Grid>
      </Card>
    )
  }
}

export default translate('translations')(withStyles(styles)(MediaList))
