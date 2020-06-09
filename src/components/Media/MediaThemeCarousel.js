import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import { isEmpty } from 'lodash'
import Tooltip from '@material-ui/core/Tooltip'

import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'
import MediaHtmlCarousel from './MediaHtmlCarousel'

const styles = ({ palette, type, typography }) => ({
  root: {
    fontFamily: typography.fontFamily
  },
  themeCardWrap: {
    width: '100%',
    border: `solid 1px ${palette[type].pages.media.general.card.border}`,
    backgroundColor: palette[type].pages.media.general.card.background,
    borderRadius: '4px'
  },
  tabToggleButton: {
    width: '128px'
  },
  tabToggleButtonContainer: {
    justifyContent: 'center',
    background: 'transparent',
    marginBottom: 16
  },
  marginTop: {
    marginTop: 16
  },
  sliderRoot: {
    marginBottom: '15px',
    '& .slick-prev': {
      left: '-25px'
    },
    '& .slick-next': {
      right: '-25px'
    }
  },
  sliderItem: {
    width: 'auto',
    height: '115px',
    padding: '5px 10px',
    border: '1px solid #e4e9f3'
  }
})

const MediaThemeCarousel = ({
  t,
  classes,
  options = {},
  settings,
  value,
  name,
  rootClass,
  tabs = [
    {
      value: 'Modern',
      title: 'Modern Theme'
    },
    {
      value: 'Legacy',
      title: 'Legacy Theme'
    }
  ],
  currentTab = tabs[0].value,
  onChangeTab = f => f,
  onChange
}) => {
  const slides = useMemo(() => {
    if (!isEmpty(options) && options.hasOwnProperty(currentTab)) {
      return options[currentTab].map(theme => ({
        name: theme.id,
        content: (
          <Tooltip title={theme.tooltip}>
            <img src={theme.thumb} alt={theme.id} />
          </Tooltip>
        )
      }))
    }
    return []
  }, [options, currentTab])

  const handleChangeSlide = useCallback(
    ({ name: value }) => {
      onChange({ target: { value, name } }, currentTab)
    },
    [name, onChange, currentTab]
  )

  return (
    <div className={classNames(classes.themeCardWrap, rootClass)}>
      <TabToggleButtonGroup
        className={classNames(
          classes.tabToggleButtonContainer,
          classes.marginTop
        )}
        value={currentTab}
        onChange={onChangeTab}
        exclusive
      >
        {tabs.map(({ value, title }) => (
          <TabToggleButton
            key={`theme-tab-${title}`}
            className={classes.tabToggleButton}
            value={value}
          >
            {t(title)}
          </TabToggleButton>
        ))}
      </TabToggleButtonGroup>
      <MediaHtmlCarousel
        slides={slides}
        settings={settings}
        activeSlide={value}
        onSlideClick={handleChangeSlide}
        customClasses={{
          root: classes.sliderRoot,
          sliderItem: classes.sliderItem
        }}
      />
    </div>
  )
}

MediaThemeCarousel.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool
}

MediaThemeCarousel.defaultProps = {
  values: null,
  onChange: f => f,
  error: '',
  touched: false
}

export default translate('translations')(withStyles(styles)(MediaThemeCarousel))
