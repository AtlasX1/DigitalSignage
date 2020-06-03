import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'

import { withStyles, Typography } from '@material-ui/core'

import { WhiteButton } from '../../../Buttons'
import PageContainer from '../../../PageContainer'
import ChannelsTable from './ChannelsTable'
import ChannelsSearchForm from './ChannelsSearch'
import AddChannel from './AddChannel'

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

const ChannelsLibrary = ({ t, classes }) => {
  const [selected, setSelected] = useState(0)
  return (
    <PageContainer
      pageTitle={t('Channels page title')}
      PageTitleComponent={
        selected > 0 ? (
          <div
            key="selectTitle"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography component="h2" className={classes.selectTitle}>
              {`${t('Channels page title')} |`}
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
            to="/system/channels-library/add-channel"
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {t('Add Channel table action')}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={<ChannelsSearchForm />}
    >
      <ChannelsTable selectionHandler={setSelected} />
      <Route
        path="/system/channels-library/add-channel"
        component={AddChannel}
      />
    </PageContainer>
  )
}

ChannelsLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(ChannelsLibrary))
