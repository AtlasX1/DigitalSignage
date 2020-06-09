import React, { useEffect } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { FormControlChips, FormControlInput } from '../../../Form'
import { Card } from '../../../Card'
import { selectUtils } from '../../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { getItems as getTags } from '../../../../actions/tagsActions'
import { getPlaylistGroupsAction } from '../../../../actions/playlistActions'
import { labelToSec, secToLabel } from '../../../../utils/secToLabel'

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
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: 12
      }
    }
  }
}

const PlaylistInformation = props => {
  const { t, classes, values, errors, touched, onChange } = props

  const dispatchAction = useDispatch()

  const [tags, groups] = useSelector(state => [
    state.tags.items.response,
    state.playlist.groups.response
  ])

  useEffect(
    () => {
      if (!tags.length) {
        dispatchAction(getTags({ limit: 9999 }))
      }

      dispatchAction(
        getPlaylistGroupsAction({
          limit: 9999
        })
      )
    },
    //eslint-disable-next-line
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
            handleChange={e => onChange('title', e.target.value)}
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
            handleChange={e => onChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlChips
            isMulti={false}
            customClass={classes.reactSelectContainer}
            name="mediaInfo.group"
            label={t('Create New / Add to Group')}
            options={
              groups &&
              groups.data &&
              selectUtils.convertArr(groups.data, selectUtils.toChipObj)
            }
            values={values.group.value ? values.group.value : values.group}
            handleChange={e => {
              const group = selectUtils
                .convertArr(groups.data, selectUtils.toChipObj)
                .find(i => i.value === e.target.value)
              onChange('group', group)
            }}
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlInput
            id="media-total-playtime"
            fullWidth={true}
            disabled={true}
            label={t('Total Playtime')}
            value={
              values.media.length
                ? secToLabel(
                    values.media
                      .map(i => labelToSec(i.duration))
                      .reduce((a, b) => a + b)
                  )
                : '00:00:00'
            }
          />
        </Grid>
        <Grid item xs={6} className={classes.mediaInformationInput}>
          <FormControlChips
            customClass={classes.reactSelectContainer}
            name="tags"
            label={'Tags'}
            options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
            values={values.tag}
            handleChange={e => onChange('tag', e.target.value)}
            error={errors.tag}
            touched={touched.tag}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles)(PlaylistInformation)
)
