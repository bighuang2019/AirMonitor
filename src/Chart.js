import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Colors from './Colors'

import './Chart.css'

class Chart extends PureComponent {
  units = { CO2: 'ppm', TVOC: 'ppb', Temperature: '℃', Humidity: '%' }

  getLine(title, axis) {
    const { selected } = this.props;

    return <Line
      yAxisId={axis}
      dot={false}
      type="monotone"
      hide={!selected[title]}
      dataKey={title}
      stroke={Colors[title]}
      strokeWidth={2}
    />
  }

  render() {
    return (
      <div className="chart-panel">
        <ResponsiveContainer>
          <LineChart data={this.props.data} >
            <XAxis
              dataKey="Timestamp"
              interval="preserveStartEnd"
              type={"number"}
              domain={['dataMin', 'dataMax']}
              tickCount={3}
              tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
              strokeWidth={2}
            />
            <YAxis yAxisId="left" strokeWidth={2} />
            <YAxis yAxisId="right" orientation="right" strokeWidth={2} />
            <Tooltip
              formatter={(value, name) => `${value.toFixed(2)} ${this.units[name]}`}
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
            />
            {this.getLine("CO2", "left")}
            {this.getLine("TVOC", "right")}
            {this.getLine("Temperature", "right")}
            {this.getLine("Humidity", "right")}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default Chart;
