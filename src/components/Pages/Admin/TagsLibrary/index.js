import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { bindActionCreators } from 'redux'
import { Link, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core'

import TagsTable from './TagsTable'
import Filter from './Filter'
import AddEditTags from './AddEditTags'
import { WhiteButton } from '../../../Buttons'
import PageContainer from '../../../PageContainer'
import { notificationAnalyzer } from '../../../../utils'
import { clearResponseInfo, getItems } from '../../../../actions/tagsActions'
import PageTitle from 'components/PageContainer/PageTitle'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'

const styles = ({ palette, type }) => ({
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
})

const TagsLibrary = props => {
  const {
    t,
    put,
    del,
    post,
    meta,
    tags,
    classes,
    getItems,
    enqueueSnackbar,
    clearResponseInfo,
    match
  } = props
  const [searchQuery, setSearchQuery] = useState('')

  const tagsIds = useMemo(() => tags.map(({ id }) => id), [tags])

  const selectedList = useSelectedList(tagsIds)

  const translate = useMemo(
    () => ({
      title: t('Tags page title'),
      add: t('Add Tag table action')
    }),
    [t]
  )

  useEffect(() => {
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Tag'
    )

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: meta.perPage
      })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  const handleQueryChange = useCallback(({ currentTarget: { value } }) => {
    setSearchQuery(value)
  }, [])

  const handleSearch = useCallback(() => {
    getItems({
      tag: searchQuery || undefined,
      page: 1,
      limit: meta.perPage
    })
  }, [meta.perPage, searchQuery, getItems])

  const handleReset = useCallback(() => {
    setSearchQuery('')
    getItems({
      page: 1,
      limit: meta.perPage
    })
  }, [meta.perPage, getItems])

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={`${match.url}/add-tag`}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </>
      }
      SubHeaderMenuComponent={
        <Filter
          query={searchQuery}
          onChange={handleQueryChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      }
    >
      <TagsTable selectedList={selectedList} tags={tags} meta={meta} />

      <Route path={`${match.url}/add-tag`} component={AddEditTags} />
      <Route path={`${match.url}/:id/edit`} component={AddEditTags} />
    </PageContainer>
  )
}

const mapStateToProps = ({
  tags: {
    put,
    del,
    post,
    items: { meta, response: tags }
  }
}) => ({
  put,
  del,
  post,
  meta,
  tags
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(TagsLibrary))
  )
)
