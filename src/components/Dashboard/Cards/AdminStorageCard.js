import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'

import { Card } from '../../Card'

const styles = {
  cardWrapper: {
    width: 330,
    marginBottom: '20px'
  },
  total: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2087c2'
  },
  totalLabel: {
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#888996'
  }
}

const AdminStorageCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState('0')

  useEffect(() => {
    if (info.response && info.response.storage) {
      const { utilized } = info.response.storage
      const sizeInGB = (utilized / 1024).toFixed()
      setData(sizeInGB)
    }
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        rootClassName={classNames(hoverClassName, {
          [draggingClassName]: !!dragging
        })}
        title={t('Dashboard Card Title Storage')}
        menuItems={[{ label: t('Contact Us dashboard action'), url: '' }]}
      >
        <Typography className={classes.total}>
          {data} {t('GB')}
        </Typography>
        <Typography className={classes.totalLabel}>
          {t('Dashboard Storage Total Server Utilizations')}
        </Typography>
      </Card>
    </Grid>
  )
}

AdminStorageCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool,
  info: PropTypes.object
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps)(AdminStorageCard))
)
