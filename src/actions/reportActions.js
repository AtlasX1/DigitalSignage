import * as types from './index'

const getReportItemsAction = params => ({
  type: types.GET_REPORT_ITEMS,
  params
})

const deleteSelectedReports = ids => ({
  type: types.DELETE_SELECTED_REPORTS,
  ids
})

const clearResponseInfo = () => ({
  type: types.CLEAR_REPORT_RESPONSE_INFO
})

export { getReportItemsAction, deleteSelectedReports, clearResponseInfo }
