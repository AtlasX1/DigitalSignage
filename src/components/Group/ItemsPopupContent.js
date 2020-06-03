import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'

import Loader from 'components/Loader'
import { CircleIconButton } from 'components/Buttons'

const styles = ({ palette, type }) => ({
  groupItemsWrap: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  groupItemLabel: {
    fontSize: '13px',
    lineHeight: '42px',
    color: '#74809a'
  },
  groupItemDelete: {
    fontSize: '16px',
    color: '#d35e37'
  },
  loaderContainer: {
    minHeight: 50,
    padding: 0,
    alignItems: 'center'
  },
  loaderTitle: {
    fontSize: 15
  }
})

const ItemsPopupContent = ({
  classes,
  id,
  groupItemsReducer,
  deleteGroupItemReducer,
  getGroupItems,
  onDeleteItem,
  clearGroupItemsInfo,
  renderFieldName,
  render
}) => {
  const [groupItems, setGroupItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupItemsReducer.response) {
      getGroupItems(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (groupItemsReducer.response) {
      setGroupItems(groupItemsReducer.response.data)
      clearGroupItemsInfo()
      setLoading(false)
    } else if (groupItemsReducer.error) {
      clearGroupItemsInfo()
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [groupItemsReducer])

  useEffect(() => {
    if (deleteGroupItemReducer.response) {
      getGroupItems(id)
    }
    // eslint-disable-next-line
  }, [deleteGroupItemReducer])

  const handleDelete = groupItemId => {
    onDeleteItem({
      groupId: id,
      itemId: groupItemId
    })
  }

  return loading ? (
    <Loader
      titleClassName={classes.loaderTitle}
      containerClassName={classes.loaderContainer}
    />
  ) : (
    <div>
      {groupItems.map((groupItem, index) => (
        <Grid
          key={`group-item-${index}`}
          container
          className={
            index !== groupItems.length - 1 ? classes.groupItemsWrap : ''
          }
        >
          <Grid item xs>
            <Typography className={classes.groupItemLabel}>
              {render
                ? render(groupItem)
                : renderFieldName
                ? groupItem[renderFieldName]
                : groupItem.name || groupItem.title || groupItem.fileName}
            </Typography>
          </Grid>
          <Grid item>
            <CircleIconButton
              className={classes.groupItemDelete}
              onClick={() => handleDelete(groupItem.id)}
            >
              <i className="icon-bin" />
            </CircleIconButton>
          </Grid>
        </Grid>
      ))}
    </div>
  )
}

ItemsPopupContent.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  groupItemsReducer: PropTypes.object.isRequired,
  deleteGroupItemReducer: PropTypes.object.isRequired,
  getGroupItems: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
}

export default translate('translations')(withStyles(styles)(ItemsPopupContent))
