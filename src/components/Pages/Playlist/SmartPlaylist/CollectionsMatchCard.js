import React, { useState } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { withStyles, Paper } from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import Popup from '../../../Popup'
import List from '../../../List'
import { Card } from '../../../Card'
import { CheckboxSwitcher } from '../../../Checkboxes'
import { ColoredTagChip } from '../../../Chip'
import { WhiteButton } from '../../../Buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemText
} from '../../../Dropdowns'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      padding: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].sideModal.action.background,
      marginBottom: '20px'
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '48px',
      color: palette[type].sideModal.header.titleColor
    },
    matchCardRoot: {
      padding: '10px 15px',
      marginRight: '15px',
      marginBottom: '30px',
      borderRadius: '4px',
      border: `solid 2px ${palette[type].sideModal.content.border}`,
      backgroundImage: palette[type].pages.smartPlaylist.card.background
    },
    matchCardHeader: {
      marginBottom: '10px'
    },
    matchCardHeaderText: {
      fontSize: '14px',
      color: palette[type].pages.smartPlaylist.card.titleColor
    },

    iconButton: {
      padding: 0,
      height: '32px',
      minWidth: '32px',
      lineHeight: '32px'
    },
    icon: {
      fontSize: '16px',
      color: palette[type].pages.smartPlaylist.card.button.color
    },

    tagChipRoot: {
      margin: '5px'
    },

    selectRoot: {
      width: '100%',
      minHeight: '42px',
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].pages.smartPlaylist.card.root.background,
      borderRadius: '4px',
      padding: '5px 0 5px 5px',
      whiteSpace: 'normal',
      boxShadow: 'none',
      transition: 'all 0.25s'
    },
    selectFocused: {
      boxShadow: `0 2px 4px 3px ${palette[type].sideModal.content.border}`
    },
    dropdownContainer: {
      maxHeight: '267px',
      overflow: 'auto',
      background: 'transparent'
    },
    dropdownItemSwitchBase: {
      height: '20px'
    },
    dropdownItemSwitchRoot: {
      transform: 'translateX(16px)'
    },

    filterSwitchContainer: {
      width: '100%'
    },
    filterSwitchRoot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    filterSwitchLabel: {
      color: 'inherit'
    },
    filterSwitchLabelSelected: {
      color: '#047abc'
    }
  }
}

const CollectionsMatchCard = ({
  t,
  classes,
  isExactMatch,
  collectionsTags
}) => {
  const [maxId, setMaxId] = useState(1)
  const [collections, setCollections] = useState([
    {
      id: 0,
      title: t('Match all'),
      tags: [],
      focused: false
    },
    {
      id: 1,
      title: t('Match all'),
      tags: [],
      focused: false
    }
  ])

  const onChangeHandler = (value, tag, collectionId) => {
    const collection = collections.find(
      collection => collection.id === collectionId
    )
    const index = collections.indexOf(collection)

    const tags = collection.tags

    let updatedTags

    if (value) {
      if (!tags.includes(tag)) {
        updatedTags = update(tags, { $push: [tag] })
      } else {
        return
      }
    } else {
      if (tags.includes(tag)) {
        updatedTags = update(tags, { $splice: [[tags.indexOf(tag), 1]] })
      } else {
        return
      }
    }

    setCollections(
      update(collections, {
        [index]: {
          tags: { $set: updatedTags }
        }
      })
    )
  }

  const changeFocus = (value, collectionId) => {
    const collection = collections.find(
      collection => collection.id === collectionId
    )
    const index = collections.indexOf(collection)

    setCollections(
      update(collections, {
        [index]: {
          focused: { $set: value }
        }
      })
    )
  }

  const deleteCollectionTags = collectionId => {
    const collection = collections.find(
      collection => collection.id === collectionId
    )
    const index = collections.indexOf(collection)

    setCollections(
      update(collections, {
        [index]: {
          tags: { $set: [] }
        }
      })
    )
  }

  const cloneCollection = collectionId => {
    const collection = collections.find(
      collection => collection.id === collectionId
    )
    const index = collections.indexOf(collection)

    const collectionCopy = update(collection, {
      id: { $set: maxId + 1 }
    })

    setCollections(
      update(collections, { $splice: [[index, 0, collectionCopy]] })
    )
    setMaxId(maxId + 1)
  }

  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
      title={t('Select Tags').toUpperCase()}
      titleComponent={
        <CheckboxSwitcher label={t('Exact match')} value={isExactMatch} />
      }
    >
      {collections.map(collection => (
        <Card
          key={`tags-collection-${collection.id}`}
          rootClassName={classes.matchCardRoot}
          title={collection.title}
          headerClasses={[classes.matchCardHeader]}
          headerTextClasses={[classes.matchCardHeaderText]}
          iconButtonComponent={
            <WhiteButton className={classes.iconButton}>
              <Settings className={classes.icon} />
            </WhiteButton>
          }
          menuDropdownComponent={
            <List component="nav" disablePadding={true}>
              <DropdownHoverListItem
                onClick={() => cloneCollection(collection.id)}
              >
                <DropdownHoverListItemText primary={'Clone'} />
              </DropdownHoverListItem>
              <DropdownHoverListItem
                onClick={() => deleteCollectionTags(collection.id)}
              >
                <DropdownHoverListItemText primary={'Delete All'} />
              </DropdownHoverListItem>
            </List>
          }
        >
          <Popup
            trigger={
              <Paper
                className={[
                  classes.selectRoot,
                  collection.focused ? classes.selectFocused : ''
                ].join(' ')}
              >
                {collection.tags.map((value, index) => (
                  <ColoredTagChip
                    rootClassName={classes.tagChipRoot}
                    key={`collection-${collection.id}-${index}`}
                    color={value.color}
                    label={value.label}
                  />
                ))}
              </Paper>
            }
            contentStyle={{
              width: '560px',
              boxShadow: 'none',
              borderRadius: '8px'
            }}
            arrow={false}
            onClose={() => changeFocus(false, collection.id)}
            onOpen={() => changeFocus(true, collection.id)}
          >
            <Paper className={classes.dropdownContainer}>
              {collectionsTags.map((item, index) => (
                <DropdownHoverListItem key={`collection-tag-${index}`}>
                  <CheckboxSwitcher
                    label={item.label}
                    switchContainerClass={classes.filterSwitchContainer}
                    formControlRootClass={classes.filterSwitchRoot}
                    formControlLabelClass={
                      collection.tags.includes(item)
                        ? classes.filterSwitchLabelSelected
                        : classes.filterSwitchLabel
                    }
                    switchBaseClass={classes.dropdownItemSwitchBase}
                    switchRootClass={classes.dropdownItemSwitchRoot}
                    handleChange={value =>
                      onChangeHandler(value, item, collection.id)
                    }
                    value={collection.tags.includes(item)}
                  />
                </DropdownHoverListItem>
              ))}
            </Paper>
          </Popup>
        </Card>
      ))}
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles)(CollectionsMatchCard)
)
