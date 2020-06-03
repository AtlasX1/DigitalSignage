import React from 'react'

import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Tooltip
} from 'recharts'

const COLORS = ['#d0021b', '#f5a623', '#7ed321', '#4a90e2', '#9013fe']

const CustomReportBarChart = ({ chartData }) => {
  const fontFamily = [
    '"Nunito Sans"',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(',')

  return (
    <BarChart height={218} width={536} data={chartData}>
      <CartesianGrid vertical={false} strokeDasharray="1 5" stroke="#888996" />
      <XAxis
        dataKey="name"
        tick={{
          fill: '#888996',
          fontSize: '12px',
          fontFamily
        }}
      />
      <YAxis
        axisLine={false}
        tickCount={3}
        tick={{
          fill: 'rgba(0, 0, 0, 0.25)',
          fontSize: '12px',
          fontFamily
        }}
      />
      <Tooltip
        cursor={false}
        contentStyle={{
          fontSize: '14px',
          fontFamily
        }}
      />
      <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={31}>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  )
}

export default CustomReportBarChart
