import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, Tab, Tooltip, withStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { translate } from 'react-i18next'

import {
  setOpenLeftSidebar,
  setOpenRightSidebar
} from 'actions/designGalleryActions'

import '../styles/_verticalSidebarTabs.scss'

const TabsStyles = makeStyles({
  flexContainer: {
    flexDirection: 'column'
  },
  scrollable: {
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  indicator: {
    display: 'none'
  },
  scrollButtons: {
    height: 56
  }
})

const TabContainer = ({ className, children }) => (
  <div className={classNames(className, 'tabs-content')}>{children}</div>
)

const TabLayoutStyles = makeStyles({
  withTooltip: {
    '& > span': {
      height: 60
    }
  },
  iconContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const StyledTooltip = withStyles({
  tooltip: {
    margin: '-15px 0 0 0'
  }
})(Tooltip)

const LayoutTab = translate('translations')(
  ({ t, icon, tooltip, ...props }) => {
    const { tReady, i18nOptions, defaultNS, reportNS, ...tabProps } = props
    const { iconContainer, withTooltip } = TabLayoutStyles()
    return (
      <Tab
        disableRipple
        icon={
          tooltip ? (
            <StyledTooltip title={t(tooltip)}>
              <div className={iconContainer}>{icon}</div>
            </StyledTooltip>
          ) : (
            icon
          )
        }
        classes={{
          root: classNames('item', withTooltip),
          selected: 'is-active'
        }}
        {...tabProps}
      />
    )
  }
)

const VerticalSidebarTabs = ({ layout }) => {
  const dispatch = useDispatch()
  const [isOpenLeftSidebar] = useSelector(state => [
    state.editor.designGallery.isOpenLeftSidebar
  ])
  const [activeTab, setActiveTab] = useState(isOpenLeftSidebar)
  const { flexContainer, scrollButtons, indicator, scrollable } = TabsStyles()

  const handleChangeTabs = (event, value) => {
    setActiveTab(activeTab === value ? false : value)
  }

  useEffect(() => {
    dispatch(setOpenLeftSidebar(activeTab !== false))
    dispatch(setOpenRightSidebar(activeTab === false))
    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    if (!isOpenLeftSidebar) {
      setActiveTab(isOpenLeftSidebar)
    }
    // eslint-disable-next-line
  }, [isOpenLeftSidebar])

  return (
    <div className={'tabs'}>
      <Tabs
        value={activeTab}
        onChange={handleChangeTabs}
        variant="scrollable"
        scrollButtons="off"
        className={'tabs-nav'}
        classes={{
          flexContainer,
          scrollButtons,
          indicator,
          scrollable
        }}
      >
        {layout.map(({ icon, tooltip }, key) => (
          <LayoutTab icon={icon} key={key} tooltip={tooltip} />
        ))}
      </Tabs>

      {layout.map(({ content }, key) => (
        <TabContainer
          key={key}
          className={activeTab === key ? 'is-active' : ''}
        >
          {content}
        </TabContainer>
      ))}
    </div>
  )
}

export default VerticalSidebarTabs
