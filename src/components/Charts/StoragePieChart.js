import React from 'react'

import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = [
  '#0076b9',
  '#3ca1db',
  'rgba(99, 180, 227, 0.6)',
  'rgba(99, 180, 227, 0.5)'
]

const StoragePieChart = ({ chartData }) => {
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
    <div>
      <PieChart width={115} height={115}>
        <Tooltip
          contentStyle={{
            fontSize: '14px',
            fontFamily
          }}
        />
        <Pie
          data={chartData}
          innerRadius={40}
          outerRadius={55}
          paddingAngle={0}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}

export default StoragePieChart
