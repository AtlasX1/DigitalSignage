import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Typography, Grid } from '@material-ui/core'

import Card from '../Card'
import ToggleItem from '../ToggleItem'

import { FormControlInput, FormControlSelect } from '../../../Form'
import { BlueButton, WhiteButton } from '../../../Buttons'

const styles = ({ palette, type, typography }) => {
  return {
    cardContent: {
      paddingTop: 18
    },
    selectIcon: {
      right: 10,
      opacity: 0.5
    },
    selectInput: {
      paddingLeft: 15,
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: '#494f5c',
      fontFamily: typography.fontFamily,

      '& > p': {
        color: '#494f5c',
        letterSpacing: '-0.01px',
        fontSize: 13,
        marginLeft: 8,
        fontWeight: 400
      }
    },
    inputIcon: {
      width: 16,
      position: 'absolute',
      right: '15px',
      color: '#9394A0',
      opacity: 0.5,
      bottom: 10,
      transform: 'scaleX(-1)'
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%'
    },
    inputRoot: {
      width: '100%'
    },
    inputLabel: {
      fontSize: 18
    },
    inputLabelRightText: {
      fontSize: 12,
      fontFamily: typography.fontFamily,
      color: '#0084ce',
      cursor: 'pointer'
    },
    lockButtonRoot: {
      maxWidth: 33,
      minWidth: 33,
      maxHeight: 33,
      paddingLeft: 0,
      paddingRight: 0,
      marginRight: 8
    },
    footerButtonContainer: {
      width: 'fit-content'
    },
    footerButtonLabel: {
      lineHeight: 1,
      fontSize: 12,
      color: '#0084ce'
    },
    toggleItemsContainer: {
      height: 170,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor:
        palette[type].pages.reports.generate.popup.toggleItems.border,
      borderRadius: 4,
      background:
        palette[type].pages.reports.generate.popup.toggleItems.background,
      padding: '13px 10px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    textBold: {
      fontSize: 20,
      letterSpacing: '-0.02px',
      color: '#494F5C',
      fontWeight: 'bold'
    },
    lockIcon: {
      color: '#bb4b09',
      fontSize: 20,
      transform: 'translateY(-8px)'
    }
  }
}

const values = [
  { title: 'Video', value: true },
  { title: 'Images', value: false },
  { title: 'Watcher', value: false },
  { title: 'Traffic', value: true },
  { title: 'Gallery', value: true },
  { title: 'Social', value: false }
]

const RowMatchesPopup = ({ t, classes }) => {
  const [valueSearch, setValueSearch] = useState('')
  const [operator, setOperator] = useState('equals')
  const [operatorOptions] = useState([
    {
      label: 'equals',
      value: 'equals',
      component: <Typography className={classes.textBold}>{'='}</Typography>
    },
    {
      label: 'not equal to',
      value: 'notEqual',
      component: <Typography className={classes.textBold}>{'!='}</Typography>
    },
    {
      label: 'less than',
      value: 'lessThan',
      component: <Typography className={classes.textBold}>{'<'}</Typography>
    },
    {
      label: 'greater than',
      value: 'greaterThen',
      component: <Typography className={classes.textBold}>{'>'}</Typography>
    },
    {
      label: 'less or equal',
      value: 'lessOrEqual',
      component: <Typography className={classes.textBold}>{'<='}</Typography>
    },
    {
      label: 'greater or equal',
      value: 'greaterOrEqual',
      component: <Typography className={classes.textBold}>{'>='}</Typography>
    }
  ])

  return (
    <Card
      title={`${t('Filter by')} Media Status`}
      height="100%"
      borderRadius={6}
      border={false}
      contentClassName={classes.cardContent}
      footer={
        <Grid container justify="space-between" alignItems="center">
          <Grid
            container
            alignItems="center"
            className={classes.footerButtonContainer}
          >
            <WhiteButton
              classes={{
                root: classes.lockButtonRoot
              }}
            >
              <i className={`icon-lock-2-1 ${classes.lockIcon}`} />
            </WhiteButton>

            <Typography className={classes.footerButtonLabel}>
              {t('Locked')}
            </Typography>
          </Grid>

          <BlueButton>{t('Apply')}</BlueButton>
        </Grid>
      }
    >
      <FormControlSelect
        custom
        value={operator}
        options={operatorOptions}
        handleChange={e => setOperator(e.target.value)}
        label={t('Operator')}
        nativeSelectIconClassName={classes.selectIcon}
        customMarginBottom={18}
        inputClasses={{
          input: classes.selectInput
        }}
      />

      <FormControlInput
        value={valueSearch}
        label={t('Value(s)')}
        handleChange={e => setValueSearch(e.target.value)}
        formControlRootClass={classes.inputContainer}
        formControlInputRootClass={classes.inputRoot}
        formControlLabelClass={classes.inputLabel}
        labelRightComponent={
          <Typography className={classes.inputLabelRightText}>
            {`${t('Show selected')} (8)`}
          </Typography>
        }
        icon={<i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />}
      />

      <Grid
        container
        wrap="nowrap"
        direction="column"
        className={classes.toggleItemsContainer}
      >
        {values.map((item, index) => (
          <ToggleItem key={index} title={item.title} value={item.value} />
        ))}
      </Grid>
    </Card>
  )
}

RowMatchesPopup.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(RowMatchesPopup))
