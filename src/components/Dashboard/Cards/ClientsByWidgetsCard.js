import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Card } from '../../Card'
import { ClientsByWidgetsTable } from '../../Clients'
import classNames from 'classnames'
const styles = () => ({
  cardWrapper: {
    marginBottom: '20px',
    width: '100%'
  }
})
const ClientsByWidgetsCard = ({
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
        title={t('Dashboard Card Title Clients by Widgets')}
        menuItems={[
          { label: t('Mail Us dashboard action'), url: 'mailto:' },
          { label: t('Contact Us dashboard action'), url: '' }
        ]}
      >
        <ClientsByWidgetsTable clients={info.response.clientByMediaType} />
      </Card>
    </Grid>
  )
}

ClientsByWidgetsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps)(ClientsByWidgetsCard))
)
