import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Current from './Current'
import History from './History'
import transform from './transform'
import './App.css';

class App extends PureComponent {
  static units = { CO2: 'ppm', TVOC: 'ppm', Temperature: '℃', Humidity: '%' }

  getRange = async ({ start, end }) => {
    const epochWeek = (date) => Math.floor(date.getTime() / 1000 / 86400);
    const { ok, statusText, arrayBuffer } = await fetch(`/api/history?start=${epochWeek(start)}&end=${epochWeek(end)}`);
    if (!ok) {
      throw new Error(statusText);
    }

    const rawData = await arrayBuffer();
    this.setState({ rawData })
  }

  getChart() {
    if (!this.state || !this.state.rawData) {
      return (
        <h3>Loading...</h3>
      )
    }

    if (this.state.rawData.byteLength < 100) {
      return (
        <h3>No data for selected range</h3>
      )
    }

    return (
      <div style={{ height: "460px" }}>
        <ResponsiveContainer>
          <LineChart data={transform.getMany(this.state.rawData, 50)} >
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => `${value} ${App.units[name]}`} />
            <Line yAxisId="left" dot={false} type="monotone" dataKey="CO2" stroke="#143642" />
            <Line yAxisId="left" dot={false} type="monotone" dataKey="TVOC" stroke="#0F8B8D" />
            <Line yAxisId="right" dot={false} type="monotone" dataKey="Temperature" stroke="#EC9A29" />
            <Line yAxisId="right" dot={false} type="monotone" dataKey="Humidity" stroke="#A8201A" />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Current />
        <br />
        <History />
      </React.Fragment>
    )
  }
}

export default App;
