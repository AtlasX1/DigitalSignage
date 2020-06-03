import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'
import { get as _get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import { withStyles, Grid } from '@material-ui/core'

import { FormControlChips, FormControlInput } from '../../../../../Form'
import { Card } from '../../../../../Card'
import { getPlaylistGroupsAction } from '../../../../../../actions/playlistActions'
import * as tagsActions from '../../../../../../actions/tagsActions'
import selectUtils from '../../../../../../utils/select'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      margin: '0 12px',
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].card.greyHeader.color
    },
    mediaInformationInputsWrap: {
      margin: '20px 0'
    },
    mediaInformationInput: {
      padding: '0 12px'
    },
    reactSelectContainer: {
      '& > label': {
        marginBottom: 8
      },
      '& > div': {
        padding: '0 5px'
      }
    }
  }
}

const PlaylistInformation = ({
  t,
  classes,
  values,
  errors,
  touched,
  onFormHandleChange = f => f
}) => {
  const dispatchAction = useDispatch()

  const groups = useSelector(({ playlist }) =>
    _get(playlist, 'groups.response.data')
  )
  const tags = useSelector(({ tags }) => _get(tags, 'items.response'))

  useEffect(
    () => {
      dispatchAction(
        getPlaylistGroupsAction({
          limit: 9999
        })
      )
      dispatchAction(
        tagsActions.getItems({
          limit: 9999
        })
      )
    },
    // eslint-disable-next-line
    []
  )

  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      title={t('Playlist Information').toUpperCase()}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
    >
      <Grid container className={classes.mediaInformationInputsWrap}>
        <Grid item xs={12} className={classes.mediaInformationInput}>
          <FormControlInput
            id="media-name-title"
            fullWidth={true}
            label={t('Name / Title')}
            value={values.title}
            error={errors.title}
            touched={touched.title}
            handleChange={e =>
              onFormHandleChange('playlistInfo.title', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlInput
            id="media-description"
            fullWidth={true}
            label={t('Description')}
            value={values.description}
            error={errors.description}
            touched={touched.description}
            handleChange={e =>
              onFormHandleChange('playlistInfo.description', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlChips
            isMulti={false}
            customClass={classes.reactSelectContainer}
            label={t('Create New / Add to Group')}
            options={selectUtils.convertArr(groups, selectUtils.toChipObj)}
            values={values.group}
            error={errors.group}
            touched={touched.group}
            handleChange={e =>
              onFormHandleChange('playlistInfo.group', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlInput
            id="media-total-playtime"
            fullWidth={true}
            disabled={true}
            label={t('Total Playtime')}
            value={values.totalPlayTime}
            error={errors.totalPlayTime}
            touched={touched.totalPlayTime}
            handleChange={e =>
              onFormHandleChange('playlistInfo.totalPlayTime', e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlChips
            customClass={classes.reactSelectContainer}
            label={t('Add Tags')}
            options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
            values={values.tag}
            error={errors.tag}
            touched={touched.tag}
            handleChange={e =>
              onFormHandleChange('playlistInfo.tag', e.target.value)
            }
          />
        </Grid>
      </Grid>
    </Card>
  )
}

PlaylistInformation.propTypes = {
  values: PropTypes.object,
  onFormHandleChange: PropTypes.func
}

PlaylistInformation.defaultProps = {
  values: {},
  errors: {},
  touched: {},
  onControlChange: () => {}
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(PlaylistInformation)
