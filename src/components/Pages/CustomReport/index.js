import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import PageContainer from '../../PageContainer'
import Table from './Table'

import { WhiteButton } from '../../Buttons'
import { FormControlInput } from '../../Form'

const styles = ({ palette, type, typography }) => {
  return {
    container: {},
    text: {
      color: '#74809A',
      fontSize: 11,
      letterSpacing: '-0.01px'
    },
    textTitle: {
      fontSize: 16,
      color: palette[type].pages.reports.report.color,
      letterSpacing: '-0.02px',
      fontWeight: 'bold'
    },
    buttonMarginRight14: {
      marginRight: 14
    },
    toggleButtonsGroupRoot: {
      background: '#f5f6fa',
      marginRight: 21
    },
    inputIcon: {
      width: 16,
      position: 'absolute',
      right: '15px',
      color: '#9394A0',
      opacity: 0.5,
      bottom: 10,
      lineHeight: 1,
      transform: 'scaleX(-1)'
    },
    inputRoot: {
      marginBottom: 0
    },
    inputContainer: {
      width: 321
    },
    input: {
      borderRadius: 8,
      fontSize: 13,
      color: '#74809A',
      letterSpacing: '-0.01px',
      paddingLeft: 20,
      fontFamily: typography.fontFamily
    }
  }
}

const CustomReport = ({ t, classes }) => {
  return (
    <PageContainer
      PageTitleComponent={
        <Grid container direction="column">
          <Typography className={classes.text}>
            {`${t('REPORT')}: LEADS`}
          </Typography>
          <Typography className={classes.textTitle}>
            {t('Leads - Per Month by Owner')}
          </Typography>
        </Grid>
      }
      ActionButtonsComponent={
        <Grid container>
          <WhiteButton className={classes.buttonMarginRight14}>
            {t('Chart View')}
          </WhiteButton>

          <WhiteButton className={classes.buttonMarginRight14}>
            {t('Review Filters')}
          </WhiteButton>

          <WhiteButton className={classes.buttonMarginRight14}>
            {t('Edit')}
          </WhiteButton>
        </Grid>
      }
      MiddleActionComponent={
        <FormControlInput
          placeholder={t('Search in this report')}
          formControlRootClass={classes.inputRoot}
          formControlContainerClass={classes.inputContainer}
          formControlInputClass={classes.input}
          icon={
            <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
          }
        />
      }
      subHeader={false}
      replaceInfoIcon="icon-settings-1"
    >
      <Grid container className={classes.container}>
        <Table />
      </Grid>
    </PageContainer>
  )
}

CustomReport.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(CustomReport))
