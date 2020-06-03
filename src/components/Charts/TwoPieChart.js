import React from 'react'

import { Typography } from '@material-ui/core'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <Typography
      component="tspan"
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {name}
    </Typography>
  )
}

const TwoLevelPieChart = ({ chartData, fillColors }) => {
  const firstPieData = chartData[0]
  const secondPieData = chartData[1]

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
    <PieChart width={210} height={210}>
      <Tooltip
        contentStyle={{
          fontSize: '14px',
          fontFamily
        }}
      />
      <Pie
        cx={100}
        cy={100}
        data={firstPieData}
        dataKey="value"
        outerRadius={60}
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {firstPieData.map((entry, index) => (
          <Cell
            key={`firstPie-${index}`}
            fill={fillColors[index % (fillColors.length - 1)]}
          />
        ))}
      </Pie>
      <Pie
        cx={100}
        cy={100}
        data={secondPieData}
        dataKey="value"
        innerRadius={70}
        outerRadius={100}
      >
        {secondPieData.map((entry, index) => (
          <Cell
            key={`secondPie-${index}`}
            fill={fillColors[fillColors.length - 1]}
          />
        ))}
      </Pie>
    </PieChart>
  )
}

export default TwoLevelPieChart
