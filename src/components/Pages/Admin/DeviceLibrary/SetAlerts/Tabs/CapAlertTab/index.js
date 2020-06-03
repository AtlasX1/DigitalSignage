import React, { useState } from 'react'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { Grid, Typography, withStyles } from '@material-ui/core'

import LoaderWrapper from 'components/LoaderWrapper'
import { CircularLoader } from 'components/Loaders'
import ItemsCard from '../ItemsCard'

const styles = ({ palette, type }) => ({
  tabWrap: {
    height: '100%',
    padding: '40px 0 0',
    borderTop: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabContentWrap: {
    padding: '0 30px',
    height: '100%',
    maxHeight: '100%'
  },
  tabHeader: {
    marginBottom: '20px'
  },
  tabHeaderText: {
    fontSize: '14px',
    color: '#c07c0c'
  },
  tabHeaderIcon: {
    fontSize: '24px',
    marginRight: '10px',
    color: '#f5a623'
  }
})

function CapAlertTab({ t, classes }) {
  const [isLoading] = useState(false)
  return (
    <LoaderWrapper isLoading={isLoading} loader={<CircularLoader />}>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        className={classes.tabWrap}
      >
        <Grid item className={classes.tabContentWrap}>
          <header className={classes.tabHeader}>
            <Typography className={classes.tabHeaderText}>
              <i
                className={`icon-interface-alert-triangle ${classes.tabHeaderIcon}`}
              />
              {t('Associate CAP Alerts with devices')}
            </Typography>
          </header>

          <ItemsCard
            title={t('Click devices to select')}
            data={[]}
            selectedDevices={[]}
            handleChange={f => f}
            emptyTitle={t('List is empty')}
          />
        </Grid>
      </Grid>
    </LoaderWrapper>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(CapAlertTab)
