import { Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { TableLibraryRowActionButton } from '../../../TableLibrary'
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

const styles = theme => {
  const { palette, type } = theme
  return {
    categoryItem: {
      justifyContent: 'space-between',
      display: 'flex',
      borderBottom: `1px solid ${palette[type].pages.rss.addRss.manage.border}`
    },
    categoryName: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginLeft: 5,
      lineHeight: '55px',
      color: palette[type].pages.rss.addRss.manage.category.color
    },
    categoryIcon: {
      fontSize: '24px',
      lineHeight: '55px',
      color: '#74809a'
    },
    categoryActions: {
      margin: '12px 5px 0 0'
    },
    titleWrapper: {
      display: 'flex'
    }
  }
}

const ListItem = ({ t, item: { title, id }, classes, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete(id)
  }, [id, onDelete])

  const translate = useMemo(
    () => ({
      deleteTag: t('Delete tag')
    }),
    [t]
  )

  return (
    <div className={classes.categoryItem}>
      <div className={classes.titleWrapper}>
        <div className={classes.categoryIcon}>
          <i className="icon-navigation-show-more-vertical" />
        </div>
        <Typography className={classes.categoryName}>{title}</Typography>
      </div>
      <div className={classes.categoryActions}>
        <TableLibraryRowActionButton
          actionLinks={[
            {
              label: translate.deleteTag,
              icon: 'icon-bin',
              clickAction: handleDelete
            }
          ]}
        />
      </div>
    </div>
  )
}

ListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
}
ListItem.defaultProps = {
  item: {
    title: ''
  }
}
export default translate('translations')(withStyles(styles)(ListItem))
