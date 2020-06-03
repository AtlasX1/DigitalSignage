const shapeOfBody = {
  response: [],
  error: {}
}

const deleteInitialState = {
  ...shapeOfBody,
  label: 'delete'
}

const postInitialState = {
  ...shapeOfBody,
  label: 'add'
}

const putInitialState = {
  ...shapeOfBody,
  label: 'update'
}

const shapeOfMeta = {
  meta: {
    currentPage: 1,
    from: 0,
    lastPage: 0,
    perPage: 0,
    to: 0,
    total: 0,
    count: 0,
    isLoading: true
  }
}

const shapeOfBodyWithMeta = {
  ...shapeOfBody,
  ...shapeOfMeta
}

const initialState = {
  items: {
    ...shapeOfBody,
    ...shapeOfMeta
  },
  item: {
    ...shapeOfBody,
    response: {}
  },
  post: {
    ...postInitialState
  },
  del: {
    ...deleteInitialState
  },
  put: {
    ...putInitialState
  },
  groupItems: {},
  postGroupItem: {},
  deleteGroupItem: {}
}

export {
  shapeOfBodyWithMeta,
  deleteInitialState,
  postInitialState,
  putInitialState,
  initialState,
  shapeOfBody,
  shapeOfMeta
}
