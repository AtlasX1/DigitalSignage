import moment from 'moment'

const durationToTimeSpan = (duration, units = 'seconds', format = 'HH:mm') => {
  const timeSpan = moment.duration(duration, units)
  return moment.utc(timeSpan.asMilliseconds()).format(format)
}
export default durationToTimeSpan
