import React, { useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'

import { clearResponseInfo, getItems } from 'actions/helpActions'
import { notificationAnalyzer } from 'utils'
import PageContainer from 'components/PageContainer'
import BaseTable from 'components/TableLibrary/BaseTable'
import TableRow from './TableRow'
import PageTitle from 'components/PageContainer/PageTitle'

const HelpPagesLibrary = ({
  t,
  put,
  meta,
  getItems,
  items,
  enqueueSnackbar,
  clearResponseInfo
}) => {
  const translate = useMemo(
    () => ({
      title: t('Help Pages page title')
    }),
    [t]
  )

  useEffect(() => {
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [t])

  const [selectedList, changeSelectedList] = useState({})

  const selectedCount = useMemo(() => Object.keys(selectedList).length, [
    selectedList
  ])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(enqueueSnackbar, [put], 'Help')

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: meta.perPage
      })
    }
    // eslint-disable-next-line
  }, [put])

  const columns = useMemo(
    () => [
      { id: 'page', label: 'Name', active: true },
      { id: 'url', label: 'URL', active: true },
      { id: 'enabled', label: 'Enabled', active: true }
    ],
    []
  )

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedCount} title={translate.title} />
      }
      isShowSubHeaderComponent={false}
    >
      <BaseTable
        meta={meta}
        rows={items}
        fetcher={getItems}
        columns={columns}
        onChangeSelectedList={changeSelectedList}
        selectedList={selectedList}
        placeholderMessage="No created items"
      >
        {items.map(row => (
          <TableRow
            key={`help-row-${row.page}`}
            selected={!!selectedList[row.id]}
            onSelectRow={changeSelectedList}
            row={row}
          />
        ))}
      </BaseTable>
    </PageContainer>
  )
}

const mapStateToProps = ({
  helps: {
    put,
    items: { meta, response }
  }
}) => ({
  put,
  items: response,
  meta
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
  withSnackbar(connect(mapStateToProps, mapDispatchToProps)(HelpPagesLibrary))
)
