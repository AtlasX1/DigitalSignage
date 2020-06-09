import React, { useMemo, useCallback } from 'react'
import { withStyles, Grid } from '@material-ui/core'
import { translate } from 'react-i18next'

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

const interactionTypeOptions = [
  { label: 'Swipe', value: 'swipe' },
  { label: 'Single tap', value: 'single-tap' },
  { label: 'Double tap', value: 'double-tap' },
  { label: 'Arrows', value: 'arrows' }
]

const PlaylistItemsOptions = ({
  t,
  classes,
  interactionType,
  onItemsChange = f => f,
  handleValueChange = f => f,
  selectedMedia: items = [],
  errors,
  touched
}) => {
  const applyInteractionType = useCallback(
    interactionType => {
      const newItems = [...items]
      newItems.forEach(i => (i.interactionType = interactionType))
      onItemsChange(newItems)
      handleValueChange('interactionType', interactionType)
    },
    [onItemsChange, handleValueChange, items]
  )

  const interactionTypeValue = useMemo(() => {
    const value =
      interactionType &&
      interactionTypeOptions.find(({ value }) => value === interactionType)
    return value
  }, [interactionType])

  return (
    <Grid container>
      <Grid
        item
        className={[classes.selectWrap, classes.selectWrapTransition].join(' ')}
      >
        <FormControlReactSelect
          placeholder={t('Interaction type')}
          value={interactionTypeValue}
          handleChange={event => applyInteractionType(event.target.value)}
          options={interactionTypeOptions}
          error={errors.interactionType}
          touched={touched.interactionType}
        />
      </Grid>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(PlaylistItemsOptions)
)
