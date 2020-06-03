import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import Card from '../Card'

import { BlueButton } from '../../../Buttons'
import { FormControlSelect, FormControlDateRangePickers } from '../../../Form'

import '../../../../styles/forms/_date-range-picker.scss'

const styles = ({ palette, type, typography }) => {
  return {
    cardContent: {
      paddingTop: 18
    },
    footerRemoveIcon: {
      fontSize: 20,
      color: '#74809a',
      cursor: 'pointer',

      '&:hover': {
        color: '#000'
      }
    },
    selectInput: {
      paddingLeft: 15,
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: '#494f5c',
      fontFamily: typography.fontFamily
    },
    selectIcon: {
      right: 10,
      opacity: 0.5
    },
    text: {
      color: palette[type].pages.reports.generate.popup.color,
      fontSize: 12
    },
    textBlue: {
      color: '#0084ce'
    },
    textPointer: {
      cursor: 'pointer'
    },
    marginBottom17: {
      marginBottom: 17
    },
    datePickerContainer: {
      position: 'relative'
    },
    datePickerIcon: {
      position: 'absolute',
      color: '#74809a'
    },
    datePickerIconFirst: {
      left: 105
    },
    datePickerIconSecond: {
      right: 11
    }
  }
}

const date = [{ label: 'Schedule Date', value: 'scheduleDate' }]

const range = [{ label: 'This Month', value: 'thisMonth' }]

const FilerPopup = ({ t, classes, removeIconClickHandler = f => f }) => (
  <Card
    title={`${t('Filter by')} Schedule Date`}
    overflow
    height="100%"
    borderRadius={6}
    border={false}
    contentClassName={[
      classes.cardContent,
      'GenerateCustomReport-Filters-Filter-Popup__CardContainer'
    ].join(' ')}
    footer={
      <Grid container justify="space-between" alignItems="center">
        <i
          onClick={removeIconClickHandler}
          className={['icon-bin', classes.footerRemoveIcon].join(' ')}
        />

        <BlueButton>{t('Apply')}</BlueButton>
      </Grid>
    }
  >
    <FormControlSelect
      custom
      value={'scheduleDate'}
      options={date}
      label={t('Date')}
      nativeSelectIconClassName={classes.selectIcon}
      customMarginBottom={18}
      inputClasses={{
        input: classes.selectInput
      }}
    />

    <FormControlSelect
      custom
      value={'thisMonth'}
      options={range}
      label={t('Range')}
      nativeSelectIconClassName={classes.selectIcon}
      customMarginBottom={6}
      inputClasses={{
        input: classes.selectInput
      }}
    />

    <Grid container justify="space-between" className={classes.marginBottom17}>
      <Typography className={classes.text}>
        {'Aug 1, 2019 - Aug 31, 2019'}
      </Typography>

      <Typography
        className={[classes.text, classes.textBlue, classes.textPointer].join(
          ' '
        )}
      >
        {t('Customize')}
      </Typography>
    </Grid>

    <Grid container alignItems="center" className={classes.datePickerContainer}>
      <FormControlDateRangePickers bottomMargin={false} />

      <i
        className={[
          'icon-calendar-1',
          classes.datePickerIcon,
          classes.datePickerIconFirst
        ].join(' ')}
      />

      <i
        className={[
          'icon-calendar-1',
          classes.datePickerIcon,
          classes.datePickerIconSecond
        ].join(' ')}
      />
    </Grid>
  </Card>
)

FilerPopup.propTypes = {
  classes: PropTypes.object,
  removeIconClickHandler: PropTypes.func
}

export default translate('translations')(withStyles(styles)(FilerPopup))
