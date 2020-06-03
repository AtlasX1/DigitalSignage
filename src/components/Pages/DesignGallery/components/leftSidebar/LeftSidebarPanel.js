import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useDispatch } from 'react-redux'
import { isFinite as _isNumeric } from 'lodash'

import classNames from 'classnames'

import { useBottomScrollListener } from 'react-bottom-scroll-listener'

import {
  ArrowDropDown as ArrowDropDownIcon,
  GridOn as GridOnIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@material-ui/icons'

import { IconButton, withStyles } from '@material-ui/core'

import TabButtonsGroup from '../TabButtonsGroup'
import Search from '../commonBlocks/Search'
import { FormControlCustomSelect } from 'components/Form'
import { SORTING_TYPES } from '../../constans'
import { setOpenLeftSidebar } from 'actions/signageEditorActions'

import '../../styles/_leftSidebarPanel.scss'

const styles = theme => {
  return {
    transitionInputClass: {
      border: 'none',
      boxShadow: 'none',
      color: '#9394A1',
      letterSpacing: '-0.02px;',
      marginRight: 2,
      fontSize: 12,
      lineHeight: '14px',
      fontFamily: 'Open Sans',
      fontWeight: 400,
      paddingRight: '17px',
      background: 'transparent',
      paddingTop: 0,
      paddingBottom: 0,
      position: 'relative',
      '&:hover': {
        background: 'transparent',
        color: '#494949'
      }
    },
    placeholder: {
      color: '#9394A1',
      fontFamily: 'inherit',
      fontSize: 'inherit'
    },
    transitionInputIconClass: {
      color: '#808B9C',
      fontSize: 24,
      lineHeight: 1,
      position: 'absolute',
      top: '50%',
      right: '-7px',
      marginTop: '-1px',
      transform: 'translateY(-50%)'
    },
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    sortingButton: {
      padding: 0,
      width: '18px',
      height: '18px',
      fontSize: '18px',
      marginRight: '5px',
      color: '#5C697F',
      '&:hover': {
        color: '#1481CE',
        opacity: '.8',
        backgroundColor: 'transparent'
      },
      '&:last-child': {
        marginRight: 0
      }
    },
    sortingIcon: {
      fontSize: 'inherit'
    }
  }
}

const LeftSidebarPanel = props => {
  const {
    classes,
    title,
    content,
    placeholder,
    onChangeSearch,
    withTabs,
    tabButtons,
    sortingBy,
    onChangeSorting,
    withFilter,
    filterOptions = [],
    onChangeFilter,
    onChangeTabs,
    activeTab,
    searchTerm,
    onContentScrollEnd,
    scrollPosition
  } = props

  const dispatchAction = useDispatch()

  const [filter, setFilter] = useState(null)
  const [isFilterOpen, setFilterOpen] = useState(false)

  const contentRef = useBottomScrollListener(onContentScrollEnd)
  const sortingControls = [
    {
      name: SORTING_TYPES.grids,
      template: <GridOnIcon className={classes.sortingIcon} />
    },
    {
      name: SORTING_TYPES.row,
      template: <MenuIcon className={classes.sortingIcon} />
    }
  ]

  // ---- methods

  const handleSelectChange = value => {
    setFilter(value)
    setFilterOpen(false)
  }

  const handleChangeTabs = (e, value) => {
    value && onChangeTabs(value)
  }

  const handleCloseTab = () => {
    dispatchAction(setOpenLeftSidebar(false))
  }

  // ---- effects

  useEffect(() => {
    if (contentRef && _isNumeric(scrollPosition)) {
      contentRef.current.scrollTop = scrollPosition
    }
    // eslint-disable-next-line
  }, [scrollPosition])

  useEffect(() => {
    if (filter) {
      onChangeFilter(filter.value)
    }
    // eslint-disable-next-line
  }, [filter])

  // ---- UI

  return (
    <div className={'tabPane'}>
      <div className={'tabPane-header'}>
        <div className={'tabPane-title'}>{title}</div>
        <IconButton
          className={'tabPane-header__close'}
          onClick={handleCloseTab}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={'tabPane-search'}>
        <Search
          placeholder={placeholder}
          value={searchTerm}
          onChange={onChangeSearch}
        />
      </div>

      {withTabs && (
        <div className={'tabPane-tabs'}>
          <TabButtonsGroup
            fullWidth
            value={activeTab}
            onChange={handleChangeTabs}
            buttons={tabButtons}
          />
        </div>
      )}

      {withFilter && (
        <div className={'tabPane-filter'}>
          <div className={'tabPane-filter__dropdown'}>
            <FormControlCustomSelect
              placeholder={'Advanced Filter'}
              value={filter}
              options={filterOptions}
              handleChange={handleSelectChange}
              inputClassName={classes.transitionInputClass}
              disableRipple
              dropdownPosition="bottom left"
              customOpen={isFilterOpen}
              onOpen={() => setFilterOpen(true)}
              onClose={() => setFilterOpen(false)}
              customClasses={{ value: classes.placeholder }}
              customIcon={
                <ArrowDropDownIcon
                  className={classes.transitionInputIconClass}
                />
              }
              customContentStyle={{
                height: 'auto',
                maxHeight: 200
              }}
            />
          </div>
          <div className={'tabPane-filter__sorting'}>
            {sortingControls.map(({ name, template }, key) => (
              <IconButton
                key={key}
                className={classNames(classes.sortingButton, {
                  'is-active': name === sortingBy
                })}
                onClick={() => onChangeSorting(name)}
              >
                {template}
              </IconButton>
            ))}
          </div>
        </div>
      )}

      {content && (
        <div ref={contentRef} className={'tabPane-content scroll-container'}>
          {content}
        </div>
      )}
    </div>
  )
}

LeftSidebarPanel.propTypes = {
  title: PropTypes.element,
  content: PropTypes.element,
  placeholder: PropTypes.string,
  onChangeSearch: PropTypes.func,
  withTabs: PropTypes.bool,
  tabButtons: PropTypes.array,
  withFilter: PropTypes.bool,
  onChangeTabs: PropTypes.func,
  activeTab: PropTypes.string,
  searchTerm: PropTypes.string,
  onContentScrollEnd: PropTypes.func
}

export default withStyles(styles)(LeftSidebarPanel)
