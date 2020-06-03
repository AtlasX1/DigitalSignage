import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import { withStyles, Paper, Grid, Typography, RootRef } from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import Popup from 'components/Popup'
import { WhiteButton } from 'components/Buttons'
import { FormControlInput } from 'components/Form'
import ItemsPopupContent from 'components/Group/ItemsPopupContent'

const styles = ({ palette, type }) => ({
  root: {
    padding: '25px',
    marginBottom: '15px',
    border: `1px solid ${palette[type].groupCard.border}`,
    borderLeft: '5px solid #3983ff',
    backgroundColor: palette[type].groupCard.background,
    borderRadius: '7px',
    boxShadow: `0 1px 4px 0 ${palette[type].groupCard.shadow}`
  },
  groupTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: palette[type].groupCard.titleColor,
    cursor: 'pointer'
  },
  groupItemsWrapper: {
    width: '325px'
  },
  groupItemsContainer: {
    padding: '10px 15px'
  },
  groupItemsLabel: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: palette[type].groupCard.item.label
  },
  actionBtn: {
    minWidth: '32px',
    paddingLeft: '5px',
    paddingRight: '5px',
    boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
    color: '#0a83c8',

    '&:hover': {
      borderColor: '#1c5dca',
      backgroundColor: '#1c5dca',
      color: '#f5f6fa'
    }
  },
  actionBtnIcon: {
    width: 18,
    height: 18,
    color: palette[type].groupCard.button.color
  },
  userPermissionsDropdownContainer: {
    width: '400px'
  },
  userPermissionsDropdown: {}
})

const GroupCard = ({
  id,
  classes,
  rootClassName,
  title,
  itemsCount,
  groupItemsLabel,
  color,
  ActionDropdownComponent,
  dropItemType,
  onMoveItem,
  onChangeGroupTitle,
  itemsPopupProps,
  useActionDropdown,
  actionLink
}) => {
  const [groupTitle, setGroupTitle] = useState(title)
  const [editTitle, setEditTitle] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: dropItemType || '',
    drop: e => onMoveItem(e.id, id),
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })

  const handleInputChange = useCallback(({ currentTarget }) => {
    setGroupTitle(currentTarget.value)
  }, [])

  const handleChangeTitle = useCallback(() => {
    setEditTitle(false)
    onChangeGroupTitle(id, groupTitle)
  }, [id, groupTitle, onChangeGroupTitle])

  const handleEnterKeyPress = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleChangeTitle()
      }
    },
    [handleChangeTitle]
  )

  const handleFocus = useCallback(() => {
    setGroupTitle(title)
    setEditTitle(true)
  }, [title])

  const handleBlur = useCallback(() => {
    handleChangeTitle()
  }, [handleChangeTitle])

  return (
    <RootRef rootRef={drop}>
      <Paper
        style={{
          borderLeftColor: color,
          borderRightColor: isOver ? color : '',
          borderTopColor: isOver ? color : '',
          borderBottomColor: isOver ? color : ''
        }}
        className={[classes.root, rootClassName].join(' ')}
      >
        <div onClick={() => setEditTitle(true)} onKeyDown={handleEnterKeyPress}>
          {editTitle ? (
            <FormControlInput
              autoFocus
              id="group-title"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={groupTitle}
              onChange={handleInputChange}
            />
          ) : (
            <Typography className={classes.groupTitle}>{title}</Typography>
          )}
        </div>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Popup
              position="bottom left"
              trigger={
                <Typography className={classes.groupItemsLabel}>
                  {itemsCount} {groupItemsLabel}
                </Typography>
              }
              contentStyle={{
                width: '325px',
                padding: '10px 15px',
                borderRadius: '6px',
                animation: 'fade-in 200ms'
              }}
            >
              <ItemsPopupContent {...itemsPopupProps} id={id} />
            </Popup>
          </Grid>
          <Grid item>
            {useActionDropdown ? (
              <Popup
                on="hover"
                position="right center"
                trigger={
                  <WhiteButton className={classes.actionBtn}>
                    <Settings className={classes.actionBtnIcon} />
                  </WhiteButton>
                }
                contentStyle={{
                  width: '400px',
                  padding: '0',
                  borderRadius: '6px',
                  animation: 'fade-in 200ms'
                }}
              >
                {ActionDropdownComponent}
              </Popup>
            ) : (
              <WhiteButton
                className={classes.actionBtn}
                component={Link}
                to={{
                  pathname: actionLink,
                  state: {
                    name: title
                  }
                }}
              >
                <Settings className={classes.actionBtnIcon} />
              </WhiteButton>
            )}
          </Grid>
        </Grid>
      </Paper>
    </RootRef>
  )
}

GroupCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  classes: PropTypes.object.isRequired,
  rootClassName: PropTypes.string,
  title: PropTypes.string,
  itemsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  groupItemsLabel: PropTypes.string,
  color: PropTypes.string.isRequired,
  ActionDropdownComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
    .isRequired,
  dropItemType: PropTypes.string.isRequired,
  onMoveItem: PropTypes.func.isRequired,
  onChangeGroupTitle: PropTypes.func.isRequired,
  itemsPopupProps: PropTypes.object.isRequired,
  useActionDropdown: PropTypes.bool,
  actionLink: PropTypes.string
}

GroupCard.defaultProps = {
  rootClassName: '',
  title: '',
  itemsCount: 0,
  groupItemsLabel: 'Items',
  useActionDropdown: true,
  actionLink: ''
}

export default withStyles(styles)(GroupCard)
