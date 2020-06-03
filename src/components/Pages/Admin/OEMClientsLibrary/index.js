import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'

import { WhiteButton } from '../../../Buttons'
import PageContainer from '../../../PageContainer'
import OEMClientsTable from './OEMClientsTable'
import OEMClientsSearchForm from './OEMClientsSearch'
import AddEditOEMClient from './AddEditOEMClient'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionIcons: {
      marginRight: '17px'
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    },

    circleButton: {
      color: '#afb7c7',

      '&:hover': {
        color: '#1c5dca'
      }
    },
    selectTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    selectSubTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    }
  }
}

const OEMClientsLibrary = ({ classes, t }) => {
  const [selected, setSelected] = useState(0)
  return (
    <PageContainer
      pageTitle={t('OEM Clients page title')}
      PageTitleComponent={
        selected > 0 ? (
          <div
            key="selectTitle"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography component="h2" className={classes.selectTitle}>
              {`${t('OEM Clients page title')} |`}
            </Typography>
            {'\u00A0'}
            <Typography
              component="h3"
              variant="subtitle1"
              className={classes.selectSubTitle}
            >
              {`${selected} ${t('selected')}`}
            </Typography>
          </div>
        ) : (
          false
        )
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to="/system/oem-clients-library/add-client"
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {t('Create OEM Client table action')}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={<OEMClientsSearchForm />}
    >
      <OEMClientsTable selectionHandler={setSelected} />
      <Route
        path="/system/oem-clients-library/add-client"
        component={AddEditOEMClient}
      />
      <Route
        path="/system/oem-clients-library/:id/edit"
        component={AddEditOEMClient}
      />
    </PageContainer>
  )
}

OEMClientsLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(OEMClientsLibrary))
