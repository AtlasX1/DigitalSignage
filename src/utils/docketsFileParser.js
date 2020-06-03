export const parseJsonHeader = content => {
  try {
    if (typeof content === 'string') {
      content = JSON.parse(content)
    }
    if (!content || !content.events_data || !content.events_data.length) {
      return {}
    }
    return content.events_data[0]
  } catch {
    return {}
  }
}

export const parseXmlHeader = content => {
  try {
    const itemOpenTag = '<entry>'
    const itemCloseTag = '</entry>'
    const headerTagStart = content.indexOf(itemOpenTag) + itemOpenTag.length
    const headerTag = content
      .substr(headerTagStart, content.indexOf(itemCloseTag) - headerTagStart)
      .replace(/\s/g, '')

    const columnsData = headerTag
      .split('<')
      .filter((i, idx) => idx % 2 === 1)
      .map(data => data.split('>'))

    return columnsData.reduce(
      (result, [header, val]) => ({ ...result, [header]: val }),
      {}
    )
  } catch {
    return {}
  }
}

export const parseCsvHeader = content => {
  try {
    const [header, col] = content.split(/[\r\n]/).filter(x => x)
    const values = col.split(',')
    return header
      .split(',')
      .reduce(
        (result, column, idx) => ({ ...result, [column]: values[idx] || '' }),
        {}
      )
  } catch {
    return {}
  }
}

export const parseFileHeader = (content, type) => {
  switch (type) {
    case 'application/json':
      return parseJsonHeader(content)
    case 'text/xml':
    case 'application/xml':
      return parseXmlHeader(content)
    case 'text/csv':
      return parseCsvHeader(content)
    default:
      return {}
  }
}
