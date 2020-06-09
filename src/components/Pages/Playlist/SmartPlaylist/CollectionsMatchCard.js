import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { get as _get } from 'lodash'

import { useDispatch, useSelector } from 'react-redux'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import List from 'components/List'
import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { WhiteButton } from 'components/Buttons'
import { Scrollbars } from 'components/Scrollbars'
import { FormControlChips } from 'components/Form'
import {
  DropdownHoverListItem,
  DropdownHoverListItemText
} from 'components/Dropdowns'

import { selectUtils } from 'utils'

import { getItems as getTags } from 'actions/tagsActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardRootClass: {
      height: '100%'
    },
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
    reactSelectContainer: {
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0
      }
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
    },
    action: {
      paddingTop: 9,
      paddingBottom: 9,
      marginBottom: 20
    },
    actionDefault: {
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color
    },
    noCollections: {
      borderRadius: '4px',
      backgroundColor: '#fff9f0',
      fontSize: '14px',
      lineHeight: '65px',
      color: '#f5a623',
      textAlign: 'center'
    },
    noCollectionsIcon: {
      fontSize: '20px',
      color: '#f5a623'
    }
  }
}

const CollectionsMatchCard = ({
  t,
  classes,
  values,
  errors,
  touched,
  onChange = f => f,
  onBuild = f => f,
  mode
}) => {
  const dispatchAction = useDispatch()

  const [tags] = useSelector(state => [state.tags.items.response])

  const [isInit, setInit] = useState(mode === 'edit' ? true : false)

  const [collections, setCollections] = useState([])

  useEffect(
    () => {
      if (!tags.length) {
        dispatchAction(getTags({ limit: 9999 }))
      }
    },
    //eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (values.tagList.length && isInit && tags.length) {
        setInit(false)
        initCollections()
      }
      if (!values.tagList.length && !isInit && tags.length) {
        setCollections([])
      }
    },
    //eslint-disable-next-line
    [values.tagList, tags]
  )

  useEffect(
    () => {
      if (collections.length && !isInit) {
        const builtCollection = collections.map(item => ({
          block: item.id,
          tagId: item.tags.map(i => i.value)
        }))
        onChange('tagList', builtCollection)
      }
    },
    //eslint-disable-next-line
    [collections]
  )

  const initCollections = () => {
    const arr = []
    values.tagList.forEach(item => {
      const { block, tagId } = item

      const collectionItem = {
        id: block,
        title: t('Match all'),
        tags: []
      }

      const findTag = id =>
        selectUtils
          .convertArr(tags, selectUtils.tagToChipObj)
          .find(i => i.value === id)

      if (Array.isArray(tagId)) {
        tagId.forEach(n => {
          const tagItem = findTag(n)
          collectionItem.tags.push(tagItem)
        })
      } else {
        const tagItem = findTag(tagId)
        collectionItem.tags.push(tagItem)
      }

      arr.push(collectionItem)
    })

    setCollections(arr)
  }

  const onChangeHandler = (value, index) => {
    setCollections(
      update(collections, {
        [index]: {
          tags: { $set: value }
        }
      })
    )
  }

  const deleteCollectionTags = index => {
    setCollections(
      update(collections, {
        [index]: {
          tags: { $set: [] }
        }
      })
    )
  }

  const deleteCollection = index => {
    setCollections(update(collections, { $splice: [[index, 1]] }))
  }

  const cloneCollection = index => {
    const collection = collections[index]

    const collectionCopy = update(collection, {
      id: { $set: collections.length + 1 }
    })

    setCollections(
      update(collections, { $splice: [[index, 0, collectionCopy]] })
    )
  }

  const addCollection = () => {
    setCollections(
      update(collections, {
        $push: [
          {
            id: collections.length + 1,
            title: t('Match all'),
            tags: [],
            focused: false
          }
        ]
      })
    )
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
        <CheckboxSwitcher
          label={t('Exact match')}
          value={values.exactMatch}
          handleChange={val => onChange('exactMatch', val)}
        />
      }
      classes={{
        root: classes.cardRootClass
      }}
    >
      <Scrollbars style={{ height: 'calc(100% - 50px)' }}>
        {collections.map((collection, index) => (
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
                <DropdownHoverListItem onClick={() => cloneCollection(index)}>
                  <DropdownHoverListItemText primary={'Clone'} />
                </DropdownHoverListItem>
                <DropdownHoverListItem
                  onClick={() => deleteCollectionTags(index)}
                >
                  <DropdownHoverListItemText primary={'Delete All Tags'} />
                </DropdownHoverListItem>
                <DropdownHoverListItem onClick={() => deleteCollection(index)}>
                  <DropdownHoverListItemText primary={'Delete Collection'} />
                </DropdownHoverListItem>
              </List>
            }
          >
            <FormControlChips
              customClass={classes.reactSelectContainer}
              name="tags"
              label={''}
              options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
              values={collection.tags}
              handleChange={e => onChangeHandler(e.target.value, index)}
              error={_get(errors, ['tagList', index, 'tagId'])}
              touched={touched.tagList}
            />
          </Card>
        ))}

        {!collections.length && (
          <Grid container style={{ marginBottom: 20 }}>
            <Grid item xs={12}>
              <Typography className={classes.noCollections}>
                <i
                  className={`icon-interface-alert-triangle ${classes.noCollectionsIcon}`}
                />
                Please add at least one collection to build playlist
              </Typography>
            </Grid>
          </Grid>
        )}

        <Grid container justify={'space-between'} style={{ paddingRight: 15 }}>
          <Grid item>
            <WhiteButton
              fullWidth={false}
              className={[classes.action, classes.actionDefault].join(' ')}
              onClick={addCollection}
            >
              {t('Add Collection')}
            </WhiteButton>
          </Grid>
          <Grid item>
            <WhiteButton
              fullWidth={false}
              className={[classes.action, classes.actionDefault].join(' ')}
              onClick={onBuild}
            >
              {t('Build Playlist')}
            </WhiteButton>
          </Grid>
        </Grid>
      </Scrollbars>
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles)(CollectionsMatchCard)
)
