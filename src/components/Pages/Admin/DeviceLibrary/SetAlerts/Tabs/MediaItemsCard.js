import React, { memo, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { withStyles, List, ListItem, ListItemText } from '@material-ui/core'
import classNames from 'classnames'
import ItemsCard from './ItemsCard'
import { isEqual } from 'utils/generalUtils'

function styles({ type, palette }) {
  return {
    list: {
      padding: '0 20px',
      width: '100%'
    },
    listItem: {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].sideModal.content.border,
      cursor: 'pointer'
    },
    listItemActive: {
      background: palette[type].table.body.row.selected.background
    },
    listItemText: {
      fontSize: 15,
      color: '#74809a'
    }
  }
}

function MediaItem({ id, title, classes, isSelected, onClick }) {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])
  return (
    <ListItem
      className={classNames(classes.listItem, {
        [classes.listItemActive]: isSelected
      })}
      onClick={handleClick}
    >
      <ListItemText
        primary={title}
        classes={{
          primary: classes.listItemText
        }}
      />
    </ListItem>
  )
}

const MediaItemMemoized = memo(MediaItem)

function MediaItemsCard({ t, classes, data, onChange, selectedMedia, error }) {
  const renderMediaItems = useMemo(() => {
    return data.map(({ id, title }) => {
      return (
        <MediaItemMemoized
          key={id}
          id={id}
          title={title}
          classes={classes}
          onClick={onChange}
          isSelected={isEqual(id, selectedMedia)}
        />
      )
    })
  }, [data, classes, selectedMedia, onChange])
  return (
    <ItemsCard title={t('Select Media')} error={error}>
      <List className={classes.list}>{renderMediaItems}</List>
    </ItemsCard>
  )
}

MediaItemsCard.propTypes = {
  data: PropTypes.array
}

MediaItemsCard.defaultProps = {
  t: f => f,
  classes: {},
  data: []
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(MediaItemsCard)
