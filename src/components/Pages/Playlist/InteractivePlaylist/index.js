import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { compose } from 'redux'

import { withStyles } from '@material-ui/core'

import { SideModal } from 'components/Modal'
import CreatePlaylistLayout from '../CreatePlaylistLayout'
import CreatePlaylistForm from './CreatePlaylistForm'

const styles = () => ({
  sideModalContent: {
    overflow: 'auto'
  }
})

const InteractivePlaylist = ({ t, classes, edit }) => (
  <SideModal
    width="95%"
    title={
      edit ? t('Edit Interactive Playlist') : t('Create Interactive Playlist')
    }
    closeLink="/playlist-library"
    childrenWrapperClass={classes.sideModalContent}
  >
    <CreatePlaylistLayout
      routePath={`/playlist-library/interactive-playlist${
        edit === 'edit' ? '/:id/edit' : ''
      }`}
    >
      {props => <CreatePlaylistForm {...props} />}
    </CreatePlaylistLayout>
  </SideModal>
)

InteractivePlaylist.propTypes = {
  classes: PropTypes.object.isRequired,
  edit: PropTypes.bool
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(InteractivePlaylist)
