import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import _get from 'lodash/get'
import { withStyles } from '@material-ui/core'

import { FormControlInput, FormControlChips } from '../Form'
import { Card } from '../Card'
import ValidityCard from './ValidityCard'
import PriorityCard from './PriorityCard'

import { selectUtils } from 'utils/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: 20
    },
    header: {
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background,
      marginBottom: '35px',
      borderRadius: '4px'
    },
    headerText: {
      paddingLeft: 13,
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.header.titleColor,
      fontSize: '0.875rem'
    },
    mediaInformationInputsWrap: {
      marginBottom: '20px'
    },
    advancedSettingsText: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    reactSelectContainer: {
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  }
}

const groupControlOnChangeTransformer = (options, handler) => ({
  target: { name, value }
}) =>
  handler({
    target: {
      name,
      value: options.find(x => x.value === value)
    }
  })

const MediaInfo = ({
  t,
  title = t('Media Information'),
  classes,
  values,
  errors,
  touched,
  onControlChange,
  onFormHandleChange,
  tags,
  groups,
  dayPickerProps
}) => {
  const [expandState, toggleExpandState] = useState({
    validity: false,
    priority: false
  })
  const toggleExpand = card => {
    switch (card) {
      case 'validity':
        toggleExpandState({
          validity: !expandState.validity,
          priority: expandState.priority
        })
        break
      case 'priority':
        toggleExpandState({
          validity: expandState.validity,
          priority: !expandState.priority
        })
        break
      default:
        break
    }
  }

  const handleFieldChange = (fieldName, fieldValue) => {
    onControlChange(`mediaInfo.${fieldName}`, fieldValue)
  }

  const groupOptions = selectUtils.convertArr(groups, selectUtils.toChipObj)

  return (
    <section className={classes.root}>
      <Card
        icon={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        removeSidePaddings={true}
        headerSidePaddings={true}
        removeNegativeHeaderSideMargins={true}
        title={title}
        headerClasses={[classes.header]}
        headerTextClasses={[classes.headerText]}
      >
        <div className={classes.mediaInformationInputsWrap}>
          <FormControlInput
            id="media-name-title"
            fullWidth={true}
            label={t('Name / Title')}
            value={values.title}
            error={errors.title}
            touched={touched.title}
            name="mediaInfo.title"
            handleChange={onFormHandleChange}
          />
          <FormControlChips
            isMulti={false}
            customClass={classes.reactSelectContainer}
            name="mediaInfo.group"
            label={t('Create New / Add to Group')}
            options={groupOptions}
            values={values.group}
            handleChange={groupControlOnChangeTransformer(
              groupOptions,
              onFormHandleChange
            )}
          />
          <FormControlChips
            customClass={classes.reactSelectContainer}
            name="mediaInfo.tags"
            label={t('Add Tags')}
            options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
            values={values.tags}
            handleChange={onFormHandleChange}
          />
        </div>
      </Card>
      <ValidityCard
        expanded={expandState.validity}
        handler={() => toggleExpand('validity')}
        activeDate={values.activeDate}
        expireDate={values.expireDate}
        onActiveDateChange={date => handleFieldChange('activeDate', date)}
        onExpireDateChange={date => handleFieldChange('expireDate', date)}
        dayPickerProps={dayPickerProps}
      />
      <PriorityCard
        expanded={expandState.priority}
        handler={() => toggleExpand('priority')}
        value={!!values.priority}
        onControlChange={val => handleFieldChange('priority', val)}
      />
    </section>
  )
}

MediaInfo.propTypes = {
  values: PropTypes.object,
  onControlChange: PropTypes.func
}

MediaInfo.defaultProps = {
  values: {},
  errors: {},
  touched: {},
  onControlChange: () => {}
}

const mapStateToProps = ({ tags, media }) => ({
  tags: _get(tags, 'items.response', []),
  groups: _get(media, 'groups.response.data', [])
})

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps)
)(MediaInfo)
