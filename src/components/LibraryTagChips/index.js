import {
  Grid,
  IconButton,
  withStyles,
  withTheme,
  Tooltip
} from '@material-ui/core'
import React from 'react'
import Popup from 'reactjs-popup'
import { TagChip } from '../Chip'
import PropTypes from 'prop-types'

const LibraryTagChips = withStyles(({ palette, type }) => ({
  tagsListWrap: {
    display: 'grid',
    grid: 'min-content 1fr / repeat(3, min-content)',
    gap: '5px',
    justifyItems: 'start',
    paddingLeft: '20px',
    maxWidth: '300px'
  },
  tagRoot: {
    width: 'fit-content',
    margin: '0 10px 0 0',
    '& > span': {
      display: 'inline',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '8ch'
    }
  },
  overflowIconWrap: {
    padding: '0px',
    width: '22px',
    height: '22px'
  },
  overflowIconContent: {
    fontSize: '20px',
    width: 'inherit',
    height: 'inherit',
    color: palette[type].header.rightAction.iconColor
  },
  overflowIcon: {
    transform: 'rotate(90deg)'
  },
  popupContent: {
    padding: '5px'
  },
  popupTag: {
    margin: '5px 0 5px 5px'
  }
}))(({ tags, classes, theme: { palette, type } }) =>
  tags && tags.length > 0 && tags.every(({ title }) => title) ? (
    <Grid container justify="center" className={classes.tagsListWrap}>
      {tags
        .slice(0, tags.length > 5 ? 5 : tags.length)
        .map(({ title, attributes }, index) => (
          <Tooltip key={`tag-${index}`} title={title.length >= 8 ? title : ''}>
            <Grid item className={classes.tagWrap}>
              <TagChip
                label={title}
                background={attributes.tagBgColor}
                style={{
                  color: attributes.tagTextColor
                }}
                classes={{
                  root: classes.tagRoot
                }}
              />
            </Grid>
          </Tooltip>
        ))}
      {tags.length > 5 && (
        <Popup
          on="hover"
          position="bottom center"
          contentStyle={{
            background: palette[type].tableLibrary.body.row.dropdown.background,
            border: 'none',
            borderRadius: 6,
            animation: 'fade-in',
            padding: '0px'
          }}
          arrowStyle={{
            background: palette[type].tableLibrary.body.row.dropdown.background,
            border: 'none'
          }}
          trigger={
            <IconButton
              classes={{
                root: classes.overflowIconWrap,
                label: classes.overflowIconContent
              }}
            >
              <i
                className={[
                  'icon-navigation-show-more-vertical',
                  classes.overflowIcon
                ].join(' ')}
              />
            </IconButton>
          }
        >
          <Grid container className={classes.popupContent}>
            {tags.map(({ title, attributes }, index) => (
              <Grid item className={classes.popupTag} key={`tag-${index}`}>
                <TagChip
                  label={title}
                  background={attributes.tagBgColor}
                  style={{
                    color: attributes.tagTextColor
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Popup>
      )}
    </Grid>
  ) : (
    'N/A'
  )
)

LibraryTagChips.propTypes = {
  tags: PropTypes.array
}

LibraryTagChips.defaultProps = {
  tags: []
}

export default withTheme()(LibraryTagChips)
