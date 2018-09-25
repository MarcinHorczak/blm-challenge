import * as React from 'react';
import {
  HorizontalBarSeries,
  HorizontalBarSeriesCanvas,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';

export default class Example extends React.Component {
  public state = {
    useCanvas: false,
  };
  public render() {
    const {useCanvas} = this.state;
    const BarSeries = useCanvas
      ? HorizontalBarSeriesCanvas
      : HorizontalBarSeries;
    return (
      <div>
        <XYPlot width={700} height={300} stackBy="x">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <BarSeries data={[{y: -1, x: 10}, {y: 4, x: 5}, {y: 5, x: 15}]} />
          <BarSeries data={[{y: -2, x: 12}, {y: 4, x: 2}, {y: 5, x: 11}]} />
          <BarSeries data={[{y: 0, x: 12}, {y: 4, x: 2}, {y: 5, x: 11}]} />
        </XYPlot>
      </div>
    );
  }
}
