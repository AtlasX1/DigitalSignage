import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import Card from '../Card'
import ToggleItem from '../ToggleItem'

import { FormControlInput, FormControlSelect } from '../../../Form'
import { BlueButton } from '../../../Buttons'

const chartTypeStyles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: 52,
      height: 52,
      borderRadius: 4,
      cursor: 'pointer',

      '&:hover': {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor:
          palette[type].pages.reports.generate.popup.chartType.border,
        background:
          palette[type].pages.reports.generate.popup.chartType.background
      }
    },
    containerActive: {
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.popup.chartType.border,
      background:
        palette[type].pages.reports.generate.popup.chartType.background
    },
    icon: {
      fontSize: 24,
      width: 24,
      height: 24,
      color: '#74809a',
      position: 'relative',
      top: -4
    }
  }
}

const ChartType = withStyles(chartTypeStyles)(
  ({ title, classes, active, icon, value, handleClick = f => f }) => (
    <Tooltip title={title}>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={[
          classes.container,
          active ? classes.containerActive : ''
        ].join(' ')}
        onClick={() => handleClick(value)}
      >
        <i className={[icon, classes.icon].join(' ')} />
      </Grid>
    </Tooltip>
  )
)

const styles = ({ palette, type, typography }) => {
  return {
    marginBottom15: {
      marginBottom: 15
    },
    containerDivider: {
      position: 'relative',

      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        width: '100%',
        height: 1,
        background: '#E4E9F3'
      }
    },
    container: {
      paddingTop: 20
    },
    text: {
      fontSize: 12,
      letterSpacing: '-0.01px',
      color: palette[type].pages.reports.generate.color
    },
    textBold: {
      fontWeight: 'bold'
    },
    textMarginBottom13: {
      marginBottom: 13
    },
    inputContainer: {
      width: '100%'
    },
    inputIcon: {
      right: 10,
      color: '#B5BFD4'
    },
    input: {
      paddingLeft: 15,
      fontSize: 12,
      letterSpacing: '-0.01px',
      color: '#9394A0',
      fontFamily: typography.fontFamily
    },
    inputLabel: {
      fontSize: 18
    },
    icon: {
      fontSize: 20,
      color: '#74809a',
      cursor: 'pointer',

      '&:hover': {
        color: '#000'
      }
    }
  }
}

const charts = [
  {
    title: 'Pie',
    value: 'pie',
    icon: 'icon-business-graph-pie-2-1'
  },
  {
    title: 'Bar',
    value: 'bar',
    icon: 'icon-business-graph-bar-horizontal-1'
  },
  {
    title: 'Line',
    value: 'line',
    icon: 'icon-business-graph-line-2'
  },
  {
    title: 'Bar',
    value: 'horBar',
    icon: 'icon-business-graph-bar-1-1'
  }
]

const toggles = [
  { title: 'Show Values', value: true },
  { title: 'Show Percentages', value: false },
  { title: 'Combine Small Groups into "Others"', value: true },
  { title: 'Show Total', value: true }
]

const valueOptions = [{ label: 'Sum of Total Invoice Amount', value: 0 }]

const positionOptions = [{ label: 'Right', value: 'right' }]

const ChartSettingsPopup = ({ t, classes, chart, setChart }) => {
  const [title, setTitle] = useState('')
  return (
    <Card
      title={t('Display Chart As')}
      border={false}
      borderRadius={6}
      footer={
        <Grid container justify="space-between" alignItems="center">
          <i className={['icon-bin', classes.icon].join(' ')} />

          <BlueButton>{t('Apply')}</BlueButton>
        </Grid>
      }
    >
      <Grid
        container
        justify="space-between"
        className={[classes.marginBottom15, classes.containerDivider].join(' ')}
      >
        {charts.map((item, index) => (
          <ChartType
            key={index}
            icon={item.icon}
            value={item.value}
            active={chart === item.value}
            title={item.title}
            handleClick={setChart}
          />
        ))}
      </Grid>

      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <Typography
          className={[
            classes.text,
            classes.textBold,
            classes.textMarginBottom13
          ].join(' ')}
        >
          {t('Chart Attributes')}
        </Typography>

        <FormControlInput
          value={title}
          label={t('Chart Title')}
          handleChange={e => setTitle(e.target.value)}
          formControlContainerClass={classes.inputContainer}
          formControlLabelClass={classes.inputLabel}
        />

        <FormControlSelect
          custom
          label={t('Value')}
          options={valueOptions}
          value={0}
          formControlContainerClass={classes.inputContainer}
          nativeSelectIconClassName={classes.inputIcon}
          inputClasses={{
            input: classes.input
          }}
        />

        <Grid container direction="column" className={classes.marginBottom15}>
          {toggles.map((item, index) => (
            <ToggleItem
              key={index}
              title={item.title}
              value={item.value}
              marginBottom={15}
            />
          ))}
        </Grid>

        <FormControlSelect
          custom
          label={t('Legend Position')}
          options={positionOptions}
          value={'right'}
          formControlContainerClass={classes.inputContainer}
          nativeSelectIconClassName={classes.inputIcon}
          inputClasses={{
            input: classes.input
          }}
        />
      </Grid>
    </Card>
  )
}

ChartSettingsPopup.propTypes = {
  classes: PropTypes.object,
  chart: PropTypes.string,
  setChart: PropTypes.func
}

export default translate('translations')(withStyles(styles)(ChartSettingsPopup))
