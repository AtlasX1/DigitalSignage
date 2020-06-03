import React from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts'

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

const CustomReportLineChart = ({ chartData }) => (
  <LineChart height={218} width={536} data={chartData}>
    <CartesianGrid strokeDasharray="1 5" stroke="#888996" />
    <XAxis
      dataKey="name"
      tick={{
        fill: '#888996',
        fontSize: '12px',
        fontFamily
      }}
    />
    <YAxis
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
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
)

export default CustomReportLineChart
