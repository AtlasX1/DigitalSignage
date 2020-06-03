import { Grid, Tooltip, withStyles } from '@material-ui/core'
import { PlaylistAdd } from '@material-ui/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { translate } from 'react-i18next'
import Popup from 'reactjs-popup'
import { withRouter } from 'react-router-dom'

import { CircleIconButton } from '../Buttons'
import { CheckboxSelectAll } from '../Checkboxes'
import { TableLibraryPagination } from './index'
import AddToPlaylistModal from './AddToPlaylistModal'

const styles = theme => {
  const { palette, type } = theme
  return {
    tableFooterWrap: {
      paddingLeft: '21px',
      backgroundColor: palette[type].tableLibrary.footer.background,
      borderRadius: '0 0 4px 4px'
    },
    tableFooterCheckboxSelectAll: {
      marginRight: '10px'
    },
    tableFooterCircleIcon: {
      fontSize: '18px',
      color: '#adb7c9'
    },
    tableFooterPlaylistIcon: {
      fontSize: '20px',
      color: '#adb7c9',
      padding: '10px'
    }
  }
}

const TableLibraryFooter = ({
  t,
  page,
  data,
  selected,
  classes,
  perPage,
  pageCount,
  allSelected,
  onSelectAllClick,
  onPageChange,
  perPageOptions = [5, 10, 25],
  handleChangeRowsPerPage,
  handleClickDeleteSelectedItems,
  onPressJumper,
  ...props
}) => {
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.tableFooterWrap}
    >
      <Grid item>
        <CheckboxSelectAll
          className={classes.tableFooterCheckboxSelectAll}
          indeterminate={false}
          checked={allSelected}
          onChange={onSelectAllClick}
        />
        <CircleIconButton
          className={`hvr-grow ${classes.tableFooterCircleIcon}`}
          onClick={handleClickDeleteSelectedItems}
        >
          <i className="icon-bin" />
        </CircleIconButton>
        <CircleIconButton
          className={`hvr-grow ${classes.tableFooterCircleIcon}`}
        >
          <i className="icon-tag-1" />
        </CircleIconButton>
        {props.location.pathname === '/media-library' && (
          <Popup
            on="click"
            position={'right bottom'}
            trigger={
              <Tooltip title={t('Add Selected Media to Playlist')}>
                <CircleIconButton
                  className={`hvr-grow ${classes.tableFooterPlaylistIcon}`}
                >
                  <PlaylistAdd />
                </CircleIconButton>
              </Tooltip>
            }
            contentStyle={{
              width: 375,
              border: 'none',
              borderRadius: 6,
              animation: 'fade-in',
              padding: '0px'
            }}
            arrowStyle={{
              border: 'none'
            }}
          >
            {close => (
              <AddToPlaylistModal
                close={close}
                media={data}
                selected={selected}
              />
            )}
          </Popup>
        )}
      </Grid>
      <Grid item>
        <TableLibraryPagination
          pageCount={pageCount}
          perPageOptions={perPageOptions}
          component="div"
          perPage={perPage}
          page={page}
          onPageChange={onPageChange}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onPressJumper={onPressJumper}
        />
      </Grid>
    </Grid>
  )
}

TableLibraryFooter.propTypes = {
  classes: PropTypes.object,
  page: PropTypes.number,
  perPage: PropTypes.number,
  allSelected: PropTypes.bool,
  onSelectAllClick: PropTypes.func,
  onPageChange: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  onPressJumper: PropTypes.func,
  handleClickDeleteSelectedItems: PropTypes.func
}

export default translate('translations')(
  withRouter(withStyles(styles)(TableLibraryFooter))
)
