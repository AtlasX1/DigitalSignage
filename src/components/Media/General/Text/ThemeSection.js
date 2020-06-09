import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { translate } from 'react-i18next'
import { get as _get, isEmpty } from 'lodash'

import { SliderInputRange } from 'components/Form'
import DirectionToggle from 'components/Media/General/components/DirectionToggle'
import PaletteToggle from 'components/Media/General/components/PaletteToggle'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'
import FormControlSpeedInput from 'components/Form/FormControlSpeedInput'
import {
  downTransitions,
  leftTransitions,
  rightTransitions,
  upTransitions
} from 'components/Media/General/Text/config'
import FormControlSelectTextTheme from 'components/Form/FormControlSelectTextTheme'
import { rgbaToString } from 'components/Pages/DesignGallery/utils'

const styles = ({ palette, type }) => ({
  root: {
    border: `solid 1px ${palette[type].pages.media.general.card.border}`,
    width: '100%',
    borderRadius: '4px'
  },
  content: {
    padding: `15px 15px`,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '16px',
    gridRowGap: '16px'
  },
  headerContainer: {
    padding: '16px 0 13px 12px',
    borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
    backgroundColor: palette[type].pages.media.general.card.header.background
  },
  headerText: {
    fontWeight: 'bold',
    color: palette[type].pages.media.general.card.header.color
  },
  label: {
    fontStyle: 'normal'
  },
  palette: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  directionToggle: {
    gridRowStart: 2,
    gridRowEnd: 4
  }
})

const ThemeSection = ({
  t,
  classes,
  className,
  values,
  onChange,
  directionName,
  animationName,
  speedName,
  durationName,
  optionsPalette,
  onSelectPalette,
  errors,
  touched
}) => {
  const [BEColors, setBEColors] = useState({})
  const [palette, setPalette] = useState(optionsPalette[0])
  const [selectedPaletteType, toggleSelectedPaletteType] = useState('preset')

  const handlePaletteTypeChanges = useCallback(
    (event, value) => value && toggleSelectedPaletteType(value),
    []
  )

  const transitions = useMemo(() => {
    switch (values.text.direction) {
      case 'left':
        return leftTransitions
      case 'right':
        return rightTransitions
      case 'up':
        return upTransitions
      case 'down':
        return downTransitions
      default:
        return upTransitions
    }
  }, [values.text.direction])

  const handleChangeDirection = useCallback(
    value => {
      onChange(value)
      onChange({ target: { name: animationName, value: null } })
    },
    [animationName, onChange]
  )

  const handleChangeSpeedSlider = useCallback(
    value => {
      onChange({ target: { name: speedName, value } })
    },
    [onChange, speedName]
  )

  const handleChangeDurationSlider = useCallback(
    value => {
      onChange({ target: { name: durationName, value } })
    },
    [onChange, durationName]
  )

  const handleSelectPalette = useCallback(
    value => {
      if (!isEmpty(BEColors) && selectedPaletteType === 'custom') {
        onSelectPalette(BEColors)
      } else {
        setPalette(value)
        onSelectPalette(value)
      }
    },
    [BEColors, onSelectPalette, selectedPaletteType]
  )

  useEffect(() => {
    const option = optionsPalette.find(({ palette }) => {
      return (
        palette.title.value === values.title.fontColor &&
        palette.titleBg.value === values.title.backgroundColor &&
        palette.text.value === values.text.fontColor &&
        palette.textBg.value === values.text.backgroundColor
      )
    })
    if (option) {
      if (option.type === 'custom') {
        toggleSelectedPaletteType('custom')
      }
      setPalette(option)
    } else {
      toggleSelectedPaletteType('custom')
      setPalette(optionsPalette[6])
      setBEColors({
        palette: {
          title: { value: values.title.fontColor },
          titleBg: { value: values.title.backgroundColor },
          text: { value: values.text.fontColor },
          textBg: { value: values.text.backgroundColor }
        }
      })
    }
  }, [
    values.text.fontColor,
    values.text.backgroundColor,
    values.title.fontColor,
    values.title.backgroundColor,
    optionsPalette
  ])

  const handleChangeForceColors = useCallback((color, key) => {
    setBEColors(values => ({
      ...values,
      palette: {
        ...values.palette,
        [key]: { value: rgbaToString(color) }
      }
    }))
  }, [])

  return (
    <div className={classNames(classes.root, className)}>
      <header className={classes.headerContainer}>
        <Typography className={classes.headerText}>{t('Theme')}</Typography>
      </header>
      <div className={classes.content}>
        <FormControlSelectTextTheme
          label={t('Theme Type')}
          value={values.layout}
          onChange={onChange}
          name="layout"
          formControlLabelClass={classes.label}
          marginBottom={0}
        />
        <FormControlReactSelect
          label={t('Animation')}
          name={animationName}
          value={values.text.animation}
          options={transitions}
          formControlLabelClass={classes.label}
          onChange={onChange}
          error={_get(errors, animationName, '')}
          touched={_get(touched, animationName, false)}
        />
        <DirectionToggle
          label={t('Direction')}
          rootClass={classes.directionToggle}
          value={values.text.direction}
          name={directionName}
          onChange={handleChangeDirection}
        />
        <FormControlSpeedInput
          maxValue={45}
          minValue={1}
          step={1}
          label={t('Speed')}
          labelAtEnd={false}
          labelClass={classes.label}
          value={values.text.speed}
          onChange={handleChangeSpeedSlider}
          inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
        />
        <SliderInputRange
          maxValue={3600}
          minValue={5}
          step={1}
          label={t('Duration')}
          labelAtEnd={false}
          labelClass={classes.label}
          numberWraperStyles={{ width: 62 }}
          value={values.text.duration}
          onChange={handleChangeDurationSlider}
          inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
        />
        <PaletteToggle
          className={classes.palette}
          value={palette}
          selectedPaletteType={selectedPaletteType}
          onChangeTab={handlePaletteTypeChanges}
          onSelectPalette={handleSelectPalette}
          option={optionsPalette}
          onColorChange={handleChangeForceColors}
          forceColors={BEColors}
        />
      </div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(ThemeSection))
