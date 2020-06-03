import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { ActiveStatusChip, InactiveStatusChip } from '../Chip'

import { Card } from '../Card'

import UserPic from '../UserPic'

import { ClientSettingsAccountInfoLoader } from '../Loaders'

const styles = ({ palette, type }) => ({
  accountName: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: palette[type].pages.accountSettings.accountInfo.color
  },
  card: {
    background: 'transparent'
  },
  loaderContainer: {
    minHeight: 61
  }
})

const AccountInfoWithStatus = ({
  t,
  classes,
  loading,
  accountStatus = '',
  userName = 'Lorem Ipsum',
  imgSrc = ''
}) => {
  return (
    <Card
      shadow={false}
      radius={false}
      icon={false}
      rootClassName={classes.card}
    >
      {loading ? (
        <Grid className={classes.loaderContainer}>
          <ClientSettingsAccountInfoLoader />
        </Grid>
      ) : (
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <UserPic
              status={accountStatus}
              userName={userName}
              imgSrc={imgSrc}
            />
          </Grid>
          <Grid item>
            <Typography className={classes.accountName}>{userName}</Typography>
          </Grid>
          <Grid item>
            {accountStatus === 'Active' ? (
              <ActiveStatusChip label={t('Active').toUpperCase()} />
            ) : (
              <InactiveStatusChip label={t('Inactive').toUpperCase()} />
            )}
          </Grid>
        </Grid>
      )}
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles)(AccountInfoWithStatus)
)
