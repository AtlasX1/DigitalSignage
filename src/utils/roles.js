const parse = (data = {}) => ({
  role: data.level,
  level: data.name,
  org: data.level === 'org',
  system: data.level === 'system',
  enterprise: data.level === 'enterprise'
})

export default {
  parse
}
