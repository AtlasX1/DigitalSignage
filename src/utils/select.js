import { isArray } from 'lodash'

const nameToChipObj = obj => ({ label: obj, value: obj })
const toChipObj = obj => ({ label: obj.title, value: obj.id })
const tagToChipObj = obj => ({ label: obj.tag, value: obj.id })
const macToChipObj = obj => ({ label: obj.macAddress, value: obj.id })

const fromChipObj = obj => ({ title: obj.label, id: obj.value })
const tagFromChipObj = obj => ({ tag: obj.label, id: obj.value })
const macFromChipObj = obj => ({ macAddress: obj.label, id: obj.value })

const convertInput = input => (isArray(input) ? input : [input])

const convertArr = (arr, converter) =>
  arr ? convertInput(arr).map(converter) : []

export default {
  nameToChipObj,
  toChipObj,
  fromChipObj,
  tagToChipObj,
  tagFromChipObj,
  macToChipObj,
  macFromChipObj,
  convertInput,
  convertArr
}
