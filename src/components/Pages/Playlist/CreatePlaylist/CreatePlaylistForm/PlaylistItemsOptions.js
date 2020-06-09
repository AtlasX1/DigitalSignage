import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { withStyles, Grid } from '@material-ui/core'
import { translate } from 'react-i18next'

import { CheckboxSwitcher } from 'components/Checkboxes'

import { secToLabel } from 'utils/secToLabel'
import { FormControlReactSelect } from 'components/Form'

const styles = ({ type, typography }) => ({
  selectWrap: {
    marginRight: '20px'
  },
  switchBaseClass: {
    height: '40px'
  },
  selectWrapTransition: {
    minWidth: '154px'
  },
  selectButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    ...typography.darkText[type]
  },
  dropdownListWrap: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    ...typography.lightText[type]
  },
  errorMessage: {
    position: 'absolute',
    bottom: -15,
    color: 'red',
    fontSize: 9
  }
})

const PlaylistItemsOptions = ({
  t,
  classes,
  duration,
  randomize = false,
  onItemsChange = f => f,
  handleValueChange = f => f,
  handleTransitionChange = f => f,
  selectedMedia: items = [],
  selectedTransition,
  transitionOptions = [],
  errors,
  touched
}) => {
  const [transition, setTransition] = useState(null)

  const applyDuration = useCallback(
    duration => {
      const newItems = [...items]
      newItems.forEach(i => (i.duration = secToLabel(duration)))
      onItemsChange(newItems)
      handleValueChange('duration', secToLabel(duration))
    },
    [onItemsChange, handleValueChange, items]
  )

  const applyTransition = useCallback(
    transition => {
      const newItems = [...items]
      newItems.forEach(i => (i.transitionId = transition.id))
      onItemsChange(newItems)
      setTransition(transition)
      handleTransitionChange(transition.label)
    },
    [onItemsChange, setTransition, handleTransitionChange, items]
  )

  useEffect(
    () => {
      if (transition && transition.value)
        items.forEach(i => (i.transitionId = transition.id))
    },
    // eslint-disable-next-line
    [transition]
  )
  useEffect(
    () => {
      if (duration) {
        items.forEach(i => (i.duration = duration))
      }
    },
    // eslint-disable-next-line
    [duration]
  )
  useEffect(
    () => {
      if (selectedTransition) {
        const transition = transitionOptions.find(
          i => i.id === selectedTransition
        )
        transition && applyTransition(transition)
      }
    },
    // eslint-disable-next-line
    [selectedTransition, transitionOptions]
  )

  const durationOptions = useMemo(
    () =>
      Array.apply(null, Array(360)).map((_, idx) => {
        const val = (idx + 1) * 10
        return { label: secToLabel(val), value: val }
      }),
    []
  )

  const durationValue = useMemo(
    () => durationOptions.find(({ label }) => label === duration) || '',
    [duration, durationOptions]
  )
  return (
    <Grid container>
      <Grid
        item
        className={[classes.selectWrap, classes.selectWrapTransition].join(' ')}
      >
        <FormControlReactSelect
          placeholder={t('Select Transition')}
          value={transition}
          handleChange={event => applyTransition(event.target)}
          options={transitionOptions}
          error={errors.transition}
          touched={touched.transition}
        />
      </Grid>
      <Grid
        item
        className={[classes.selectWrap, classes.selectWrapTransition].join(' ')}
      >
        <FormControlReactSelect
          placeholder={'HH:MM:SS'}
          value={durationValue}
          handleChange={event => applyDuration(event.target.value)}
          options={durationOptions}
          error={errors.duration}
          touched={touched.duration}
        />
      </Grid>
      <Grid item>
        <CheckboxSwitcher
          label={t('Randomize')}
          switchBaseClass={classes.switchBaseClass}
          value={randomize}
          handleChange={val => handleValueChange('randomizePlaybackOrder', val)}
        />
      </Grid>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(PlaylistItemsOptions)
)
