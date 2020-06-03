import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Card } from '../../Card'
import { MediaUsageTable } from '../../Media'
import classNames from 'classnames'

const styles = () => ({
  cardWrapper: {
    marginBottom: '20px',
    width: '100%'
  }
})

const AdminMediaUsageCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        rootClassName={classNames(hoverClassName, {
          [draggingClassName]: !!dragging
        })}
        removeSidePaddings={true}
        title={t('Dashboard Card Title Media')}
        menuItems={[
          { label: t('Add New Media dashboard action'), url: '' },
          {
            label: t('Media Library dashboard action'),
            url: '/media-library'
          }
        ]}
      >
        <MediaUsageTable media={info.response.media} />
      </Card>
    </Grid>
  )
}

AdminMediaUsageCard.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps)(AdminMediaUsageCard))
)
