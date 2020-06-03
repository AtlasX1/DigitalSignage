import * as types from './index'

const getDashboardInfoAction = () => ({ type: types.GET_DASHBOARD_INFO })
const putDashboardInfoAction = data => ({
  type: types.PUT_DASHBOARD_INFO,
  payload: data
})

export { getDashboardInfoAction, putDashboardInfoAction }
