const repetitionOptions = [
  {
    value: 'dontRepeat',
    label: 'Don`t repeat'
  },
  {
    value: 'daily',
    label: 'Daily'
  },
  {
    value: 'weekly',
    label: 'Weekly'
  },
  {
    value: 'monthly',
    label: 'Monthly'
  },
  {
    value: 'everyYear',
    label: 'Every year'
  },
  {
    value: 'everyWeekday',
    label: 'Every weekday (Monday to Friday)'
  },
  {
    value: 'other',
    label: 'Other'
  }
]

const periods = [
  {
    value: 'day',
    label: 'day'
  },
  {
    value: 'week',
    label: 'week'
  },
  {
    value: 'month',
    label: 'month'
  },
  {
    value: 'year',
    label: 'year'
  }
]

const monthlyRecurrenceOptions = [
  {
    value: 'monthlyDay',
    label: 'Monthly'
  },
  {
    value: 'monthlyDayOfWeek',
    label: 'Monthly'
  }
]

export default {
  repetitionOptions,
  periods,
  monthlyRecurrenceOptions
}
