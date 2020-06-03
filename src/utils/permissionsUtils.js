import * as R from 'ramda'

import { getUrlPrefix, isNotEmpty, capitalize } from 'utils/index'

function routesConfig(isGroups, id) {
  function base(url = '') {
    return (
      getUrlPrefix(isGroups ? 'users-library/group/' : 'users-library/') + url
    )
  }

  function getLink(entity) {
    return base(`${id}/permissions/${entity}`)
  }

  function getMatch(entity) {
    return base(`:id/permissions/${entity}`)
  }

  function getCloseLink() {
    return base()
  }

  return {
    getLink,
    getMatch,
    getCloseLink
  }
}

// TODO Rename
function appendTo(acc, cur) {
  return R.apply(R.append, [cur, acc])
}

function invertAppendTo(cur, acc) {
  return R.apply(R.append, [cur, acc])
}

function push(toArr, fromArr) {
  return R.reduce(appendTo, toArr, fromArr)
}

function findId(element, arr) {
  return R.apply(R.find(R.propEq('id', R.prop('id', element))), [arr])
}

function isIdIn(element, arr) {
  return !!R.apply(findId, [element, arr])
}

function indexOf(element, arr) {
  return R.indexOf(R.apply(findId, [element, arr]), arr)
}

function replaceId(element, arr) {
  return R.update(R.apply(indexOf, [element, arr]), element, arr)
}

function pushOrReplace(acc, cur) {
  return R.apply(R.ifElse(isIdIn, replaceId, invertAppendTo), [cur, acc])
}

function concat(toArr, fromArr) {
  return R.reduce(pushOrReplace, toArr, fromArr)
}

function updateArr(arr, newArr) {
  return R.apply(R.ifElse(R.isEmpty, push, concat), [arr, newArr])
}

function update(arr, newArr) {
  return R.apply(
    R.ifElse(isNotEmpty, R.partial(updateArr, [arr]), () => arr),
    [newArr]
  )
}

function elementEntity(element) {
  return R.apply(
    R.compose(
      R.toLower,
      R.partial(R.prop, ['entity']),
      R.partial(R.prop, ['group'])
    ),
    [element]
  )
}

function filterFn(entity, element) {
  return R.equals(entity, elementEntity(element))
}

function filter(entity, arr) {
  return R.filter(R.partial(filterFn, [entity]), arr)
}

function checkboxValue(isRead, id, permissions) {
  function findFn(element) {
    return R.equals(id, element.group.id)
  }

  function element() {
    return R.find(findFn, permissions)
  }

  function permissionName() {
    return isRead ? 'readPermission' : 'writePermission'
  }

  function isPermissionEqual() {
    return R.apply(R.propEq(permissionName(), 1), [element()])
  }

  return R.apply(
    R.ifElse(element, isPermissionEqual, () => false),
    []
  )
}

function idPropName(isGroups) {
  return isGroups ? 'groupId' : 'id'
}

function createGetReqObj(isGroups, id, entity) {
  return {
    [idPropName(isGroups)]: id,
    entity: capitalize(entity)
  }
}

function createPutReqObj(isGroups, id, data) {
  return {
    [idPropName(isGroups)]: id,
    data: data
  }
}

function change(isRead, value, groupId, permissions) {
  function numValue() {
    return value ? 1 : 0
  }

  function permissionName() {
    return isRead ? 'readPermission' : 'writePermission'
  }

  function invertPermissionName() {
    return isRead ? 'writePermission' : 'readPermission'
  }

  function createObj() {
    return R.apply(
      R.pipe(
        R.partial(R.assoc, ['groupId', groupId]),
        R.partial(R.assoc, [permissionName(), numValue()]),
        R.partial(R.assoc, [invertPermissionName(), 0])
      ),
      [{}]
    )
  }

  function requestObj(element) {
    return {
      groupId: R.prop('id', R.prop('group', element)),
      readPermission: R.prop('readPermission', element),
      writePermission: R.prop('writePermission', element)
    }
  }

  function toRequestFormat() {
    return R.map(requestObj, permissions)
  }

  function findId() {
    return R.find(R.propEq('groupId', groupId), toRequestFormat())
  }

  function isIdIn() {
    return Boolean(findId())
  }

  function indexOf() {
    return R.indexOf(findId(), toRequestFormat())
  }

  function assocObj() {
    return R.assoc(permissionName(), numValue(), findId())
  }

  function update() {
    return R.update(indexOf(), assocObj(), toRequestFormat())
  }

  function push() {
    return R.append(createObj(), toRequestFormat())
  }

  function change() {
    return R.apply(R.ifElse(isIdIn, update, push), [])
  }

  return change()
}

export default {
  routesConfig,
  update,
  filter,
  checkboxValue,
  change,
  createGetReqObj,
  createPutReqObj
}
