const transformPermissions = permissions =>
  permissions.reduce((permissionsObj, item) => {
    const { group, action } = item
    permissionsObj[group] = {
      create: false,
      read: false,
      update: false,
      delete: false,
      ...permissionsObj[group],
      [action]: true
    }
    return permissionsObj
  }, {})

export default transformPermissions
