import React from 'react'
import { translate } from 'react-i18next'
import { Grid, Typography } from '@material-ui/core'

import { ClientSettingsDetailsLoader } from '../../../Loaders'

const Read = ({ t, classes, data, loading }) =>
  loading ? (
    <Grid container className={classes.detailsLoaderContainer}>
      <ClientSettingsDetailsLoader />
    </Grid>
  ) : (
    <Grid container direction="column">
      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Address').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.address1}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Address 2').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.address2}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('City').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>{data.city}</Typography>
        </Grid>
      </Grid>

      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={6} className={classes.detailRowLeft}>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('State').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {data.state}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6} className={classes.detailRowRight}>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Zip').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {data.zipCode}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Country').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.country}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Phone-1').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.phoneNo1}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Phone-2').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.phoneNo2}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        className={classes.detailRow}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Client Type').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.detailValue}>
            {data.type.title}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )

export default translate('translations')(Read)
