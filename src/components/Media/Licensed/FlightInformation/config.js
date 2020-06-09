const layout = [
  {
    label: 'Airline Logo',
    value: 'airlineLogoUrlPng'
  },
  {
    label: 'Airline Name',
    value: 'airlineName'
  },
  {
    label: 'Schedule Departure Time',
    value: 'scheduledGateTime'
  },
  {
    label: 'Actual Departure Time',
    value: 'actualTime'
  },
  {
    label: 'Destination Airport',
    value: 'airportName'
  },
  {
    label: 'Flight Number',
    value: 'flight'
  },
  {
    label: 'Status',
    value: 'remarks'
  },
  {
    label: 'Delay (in min)',
    value: 'delayedInMinutes'
  },
  {
    label: 'Terminal',
    value: 'terminal'
  },
  {
    label: 'Gate Number',
    value: 'gate'
  }
]

const airlineTypes = [
  {
    label: 'Departure',
    value: 'departures'
  },
  {
    label: 'Arrivals',
    value: 'arrivals'
  }
]

const noOfHours = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '4',
    value: 4
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '6',
    value: 6
  }
]

export { layout, airlineTypes, noOfHours }
