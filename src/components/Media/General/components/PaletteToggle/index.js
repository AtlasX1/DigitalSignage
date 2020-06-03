import React, { useMemo } from 'react'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'
import { FormControlPalettePicker } from 'components/Form'

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  content: {
    marginTop: '19px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '30px'
  },
  toggleButton: {
    width: '128px'
  },
  customPalette: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  }
})

const PaletteToggle = ({
  onSelectPalette,
  className,
  value,
  classes,
  option,
  forceColors,
  selectedPaletteType,
  onColorChange,
  onChangeTab,
  t
}) => {
  const translate = useMemo(
    () => ({
      presets: t('preset'),
      custom: t('custom')
    }),
    [t]
  )

  const customValue = useMemo(
    () => option.find(({ type }) => type === 'custom'),
    [option]
  )

  const renderPalettePicker = useMemo(
    () =>
      selectedPaletteType === 'preset' ? (
        option.map(
          item =>
            item.type === 'preset' && (
              <FormControlPalettePicker
                key={item.id}
                preset={item}
                onSelectPalette={onSelectPalette}
                disabled={selectedPaletteType === 'preset'}
                id={item.id}
                selected={value}
              />
            )
        )
      ) : (
        <FormControlPalettePicker
          className={classes.customPalette}
          onSelectPalette={onSelectPalette}
          preset={customValue}
          selected={value}
          id={customValue.id}
          allowChangeColor={true}
          forceColors={forceColors}
          onColorChange={onColorChange}
        />
      ),
    [
      classes.customPalette,
      customValue,
      forceColors,
      onColorChange,
      onSelectPalette,
      option,
      selectedPaletteType,
      value
    ]
  )

  return (
    <div className={classNames(classes.root, className)}>
      <TabToggleButtonGroup
        value={selectedPaletteType}
        exclusive
        onChange={onChangeTab}
      >
        <TabToggleButton className={classes.toggleButton} value="preset">
          {translate.presets}
        </TabToggleButton>
        <TabToggleButton className={classes.toggleButton} value="custom">
          {translate.custom}
        </TabToggleButton>
      </TabToggleButtonGroup>
      <div className={classes.content}>{renderPalettePicker}</div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(PaletteToggle))
