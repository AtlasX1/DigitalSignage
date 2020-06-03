import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { withSnackbar } from 'notistack'
import {
  Checkbox,
  Grid,
  Table,
  TableBody,
  Typography,
  withStyles
} from '@material-ui/core'

import { BlueButton } from 'components/Buttons'
import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { TablePaper } from 'components/Paper'
import { Scrollbars } from 'components/Scrollbars'
import { TableLibraryCell, TableLibraryRow } from './index'

import { playlistTypes } from 'constants/playlist'
import { secToLabel, labelToSec } from 'utils/secToLabel'
import { useCustomSnackbar } from 'hooks'
import {
  editPlaylist,
  getPlaylistItemsAction,
  clearAddedPlaylist
} from 'actions/playlistActions'

const styles = ({ palette, type }) => ({
  header: {
    padding: '15px 18px',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: palette[type].pageContainer.header.border,
    backgroundColor: palette[type].pageContainer.header.background
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '0px',
    lineHeight: '18px',
    color: palette[type].pageContainer.header.titleColor
  },
  description: {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#9394a0'
  },
  tableContainer: {
    height: '300px',
    overflow: 'hidden'
  },

  rowCheckbox: {
    padding: '20px 10px'
  },
  rowMetadata: {
    fontSize: '14px'
  },
  infoWrap: {
    paddingLeft: '10px'
  },
  duration: { paddingRight: '10px' },
  footer: {
    padding: '10px',
    borderTop: `solid 1px ${palette[type].pageContainer.header.border}`
  }
})

const AddToPlaylistModal = ({
  t,
  classes,
  media,
  selected,
  close,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const dispatch = useDispatch()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    dispatch(getPlaylistItemsAction())
  }, [dispatch])

  const storePlaylists = useSelector(({ playlist }) =>
    playlist.library.response && playlist.library.response.length > 0
      ? playlist.library.response
      : []
  )
  useEffect(() => {
    if (storePlaylists.length) {
      setPlaylists(
        storePlaylists.map(playlist => ({
          ...playlist,
          duration: secToLabel(labelToSec(playlist.duration))
        }))
      )
    }
  }, [storePlaylists])

  const playlistItemReducer = useSelector(
    ({ playlist }) => playlist.playlistItem
  )
  useEffect(() => {
    if (playlistItemReducer.status === 'error') {
      showSnackbar('An error occurred !')
    }

    if (playlistItemReducer.status === 'successfully') {
      showSnackbar('Successfully added!')
      dispatch(clearAddedPlaylist())
      form.resetForm()
      close()
    }
    // eslint-disable-next-line
  }, [playlistItemReducer])

  const form = useFormik({
    initialValues: { selectedPlaylists: [] },
    enableReinitialize: false,
    onSubmit: async ({ selectedPlaylists }) => {
      if (selectedPlaylists.length && playlists.length) {
        const playlistsData = playlists
          .filter(({ id }) => selectedPlaylists.includes(id))
          .map(playlist => ({
            ...playlist,
            media: playlist.media.map(media => ({
              ...media,
              transitionId: media.transition.id
            }))
          }))
        const mediaData =
          media &&
          media
            .filter(({ id }) => selected.includes(id))
            .map(media => ({ ...media, transitionId: 5 }))

        for (let playlist of playlistsData) {
          const requestData = {
            ...playlist,
            media: [...playlist.media, ...mediaData]
          }
          dispatch(editPlaylist({ id: requestData.id, data: requestData }))
        }
      }
    }
  })

  return (
    <Grid
      container
      component="form"
      className={classes.form}
      onSubmit={form.handleSubmit}
    >
      <Grid item xs={12} className={classes.header}>
        <Typography component="h1" className={classes.title}>
          {t('Add to Playlist Media action')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TablePaper elevation={0} className={classes.tableContainer}>
          <Scrollbars>
            <Table className={classes.table} padding="none">
              <TableBody>
                {playlists.length > 0 &&
                  playlists.map(row => {
                    return (
                      <TableLibraryRow key={row.id}>
                        <TableLibraryCell
                          classes={{ root: classes.rowCheckbox }}
                        >
                          <Checkbox
                            value={row.id}
                            checked={form.values.selectedPlaylists.includes(
                              parseInt(row.id)
                            )}
                            onChange={event => {
                              const value = parseInt(event.target.value)
                              form.setFieldValue(
                                'selectedPlaylists',
                                form.values.selectedPlaylists.includes(value)
                                  ? form.values.selectedPlaylists.filter(
                                      id => id !== value
                                    )
                                  : [...form.values.selectedPlaylists, value]
                              )
                            }}
                          />
                        </TableLibraryCell>
                        <TableLibraryCell align="left">
                          <Grid container>
                            <Grid item xs={2}>
                              <LibraryTypeIcon
                                className={classes.playlistIcon}
                                color={playlistTypes[row.playlistType].color}
                                icon={playlistTypes[row.playlistType].icon}
                                iconHelperClass={
                                  playlistTypes[row.playlistType]
                                    .iconHelperClass
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              container
                              xs={10}
                              className={classes.infoWrap}
                            >
                              <Grid item xs={12}>
                                <Typography className={classes.title}>
                                  {row.title}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography className={classes.description}>
                                  {row.description}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </TableLibraryCell>
                        <TableLibraryCell
                          classes={{ root: classes.rowMetadata }}
                        >
                          <Grid
                            container
                            justify="flex-end"
                            className={classes.duration}
                          >
                            <Typography>{row.duration}</Typography>
                          </Grid>
                        </TableLibraryCell>
                      </TableLibraryRow>
                    )
                  })}
              </TableBody>
            </Table>
          </Scrollbars>
        </TablePaper>
      </Grid>
      <Grid
        item
        container
        xs={12}
        justify="flex-end"
        className={classes.footer}
      >
        <BlueButton onClick={form.handleSubmit}>{t('Add')}</BlueButton>
      </Grid>
    </Grid>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar
)(AddToPlaylistModal)
