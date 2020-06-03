import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { SideTabs, SideTab, TabIcon } from '../../../Tabs'
import { CreatePlaylistGeneralTab } from './Tabs'
import { getConfigMediaCategory } from '../../../../actions/configActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    createPlaylistContent: {
      height: '100%'
    },
    createPlaylistTabsWrap: {
      borderRight: `1px solid ${palette[type].sideModal.content.border}`
    },
    sideModalContent: {
      overflow: 'auto'
    }
  }
}

class CreatePlaylist extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedTab: 'General'
    }
  }

  componentDidMount() {
    this.props.getConfigMediaCategory()
  }

  handleChange = (event, selectedTab) => {
    this.setState({ selectedTab })
  }

  render() {
    const { t, classes, edit, match, configMediaCategory } = this.props
    const { selectedTab } = this.state
    const { id } = match.params

    return (
      <SideModal
        width="95%"
        title={edit ? t('Edit Playlist') : t('Create Playlist')}
        closeLink="/playlist-library"
        childrenWrapperClass={classes.sideModalContent}
      >
        <Grid container wrap="nowrap" className={classes.createPlaylistContent}>
          <Grid item className={classes.createPlaylistTabsWrap}>
            <SideTabs value={selectedTab} onChange={this.handleChange}>
              {configMediaCategory.response &&
                configMediaCategory.response.length &&
                configMediaCategory.response.map(item => (
                  <SideTab
                    key={`tab_${item.name}`}
                    disableRipple={true}
                    icon={<TabIcon iconClassName={item.icon} />}
                    label={t(`${item.name} Tab`)}
                    value={item.name}
                  />
                ))}
            </SideTabs>
          </Grid>
          <Grid item xs>
            <Route
              path={`/playlist-library/${edit ? ':id/edit' : 'create'}`}
              render={props => (
                <CreatePlaylistGeneralTab
                  {...props}
                  tabName={selectedTab}
                  playlistId={id}
                />
              )}
            />
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

const mapStateToProps = ({ config }) => ({
  configMediaCategory: config.configMediaCategory
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getConfigMediaCategory
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CreatePlaylist)
