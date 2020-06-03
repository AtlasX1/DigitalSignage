import React, { Fragment, useEffect, useMemo } from 'react'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'

import { WhiteButton } from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import AddEditBanner from './AddEditBanner'
import {
  getItems,
  clearResponseInfo,
  deleteSelectedItems
} from 'actions/bannerActions'
import { notificationAnalyzer } from 'utils'
import { getConfigOrgRole } from 'actions/configActions'
import BaseTable from 'components/TableLibrary/BaseTable'
import TableRow from './TableRow'
import routeByName from 'constants/routes'
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
  }
})

const initialColumns = [
  { id: 'name', label: 'Name' },
  { id: 'enabledUserType', label: 'Enabled User Type' },
  {
    id: 'expirationDate',
    label: 'Expiration Date',
    align: 'center'
  }
]

const BannersLibrary = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  getItems,
  enqueueSnackbar,
  deleteSelectedItems,
  getConfigOrgRole,
  clearResponseInfo
}) => {
  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])

  const selectedList = useSelectedList(rowsIds)

  const translate = useMemo(
    () => ({
      tabTitle: t('Banners Library - Digital Signage'),
      title: t('Banners page title'),
      add: t('Add Banner')
    }),
    [t]
  )

  useEffect(() => {
    getItems({
      page: 1
    })
    getConfigOrgRole()
  }, [getConfigOrgRole, getItems, t, translate.tabTitle])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Banner'
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

  return (
    <PageContainer
      pageTitle={translate.title}
      isShowSubHeaderComponent={false}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={routeByName.banner.add}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
    >
      <BaseTable
        meta={meta}
        fetcher={getItems}
        columns={initialColumns}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        placeholderMessage="No saved banners"
      >
        {items.map(row => (
          <TableRow
            key={`banner-row-${row.id}`}
            row={row}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
          />
        ))}
      </BaseTable>
      <Route path={routeByName.banner.add} component={AddEditBanner} />
      <Route path={routeByName.banner.edit} component={AddEditBanner} />
    </PageContainer>
  )
}

const mapStateToProps = ({
  banners: {
    items: { meta, response },
    post,
    put,
    del
  }
}) => ({
  items: response,
  meta,
  put,
  post,
  del
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      getConfigOrgRole,
      deleteSelectedItems,
      clearResponseInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(BannersLibrary))
  )
)
