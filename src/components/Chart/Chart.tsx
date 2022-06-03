import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import useDebouncedCallback from 'use-debounce/lib/useDebouncedCallback';

import { ApplicationState } from '../../formatters/formatApplicationExecutionState';
import { DatesInterval } from '../../types';

interface ChartProps {
  prices: [number, number][]
  buys?: [number, number][]
  sells?: [number, number][]
  applicationState?: ApplicationState
  setDatesInterval: (interval: DatesInterval) => void
}

export default ({
  prices,
  buys,
  sells,
  applicationState,
  setDatesInterval,
}: ChartProps) => {
  const [setRange] = useDebouncedCallback((min: number, max: number) => {
    setDatesInterval({
      startDate: new Date(min),
      endDate: new Date(max),
    });
  }, 100);

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'x',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e-%b-%y',
        month: '%b-%y',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
      },
      labels: {
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          return Highcharts.dateFormat('%d-%b-%y', (this.value));
        },
      },
      events: {
        afterSetExtremes: (e) => {
          if (e.trigger === 'zoom') {
            setRange(e.min, e.max);
          }
        },
      },
    },
    yAxis: [
      {},
      { opposite: true },
      { opposite: true },
      { opposite: true },
      { opposite: true },
    ],
    tooltip: {
      shared: true,
      xDateFormat: '%Y-%m-%d %H:%M:%S',
    },
    series: [{
      name: 'Prices',
      type: 'line',
      data: prices,
      color: 'rgba(83, 83, 223, .5)',
    }],
  };

  if (buys && options.series) {
    options.series = options.series.concat([{
      yAxis: 0,
      name: 'Buys',
      type: 'scatter',
      data: buys,
      color: 'rgba(83, 223, 83, .5)',
      marker: {
        radius: 5,
        symbol: 'circle',
      },
      tooltip: {
        pointFormat: 'x: <b>{point.x:%d-%m-%y %H:%M:%S}</b><br/>y: <b>{point.y}</b><br/>',
      },
    }]);
  }

  if (sells && options.series) {
    options.series = options.series.concat([
      {
        yAxis: 0,
        name: 'Sells',
        type: 'scatter',
        data: sells,
        color: 'rgba(223, 83, 83, .5)',
        marker: {
          radius: 5,
          symbol: 'circle',
        },
        tooltip: {
          pointFormat: 'x: <b>{point.x:%y-%m-%d %H:%M:%S}</b><br/>y: <b>{point.y}</b><br/>',
        },
      },
    ]);
  }

  if (applicationState && options.series) {
    options.series = options.series.concat([{
      name: 'Account Amount',
      type: 'line',
      yAxis: 1,
      data: applicationState.accountAmount,
      color: 'rgba(83, 223, 223, .5)',
    }, {
      name: 'Price Average',
      type: 'line',
      data: applicationState.priceAverage,
      visible: false,
      color: '#000',
    }, {
      name: 'Price Upper Limit',
      type: 'line',
      data: applicationState.priceUpperLimit,
      visible: false,
      color: '#ccc',
    }, {
      name: 'Price Lower Limit',
      type: 'line',
      data: applicationState.priceLowerLimit,
      visible: false,
      color: '#ccc',
    }, {
      name: 'Price Standard Deviation',
      type: 'line',
      data: applicationState.priceStandardDeviation,
      visible: false,
      color: '#ccc',
    }, {
      name: 'Change',
      type: 'line',
      data: applicationState.change,
      yAxis: 2,
      visible: false,
      color: '#E65100',
    }, {
      name: 'Change Average',
      type: 'line',
      data: applicationState.changeAverage,
      yAxis: 2,
      visible: false,
      color: '#E65100',
    }, {
      name: 'Change Upper Limit',
      type: 'line',
      yAxis: 2,
      data: applicationState.changeUpperLimit,
      visible: false,
      color: '#FFAB40',
    }, {
      name: 'Change Lower Limit',
      type: 'line',
      yAxis: 2,
      data: applicationState.changeLowerLimit,
      visible: false,
      color: '#FFAB40',
    }, {
      name: 'Change Standard Deviation',
      type: 'line',
      yAxis: 2,
      data: applicationState.changeStandardDeviation,
      visible: false,
      color: '#FFAB40',
    }, {
      name: 'Acceleration',
      type: 'line',
      yAxis: 3,
      data: applicationState.acceleration,
      visible: false,
      color: '#FFA000',
    }, {
      name: 'Acceleration Average',
      type: 'line',
      data: applicationState.accelerationAverage,
      yAxis: 3,
      visible: false,
      color: '#FFA000',
    }, {
      name: 'Acceleration Upper Limit',
      type: 'line',
      data: applicationState.accelerationUpperLimit,
      yAxis: 3,
      visible: false,
      color: '#AFB42B',
    }, {
      name: 'Acceleration Lower Limit',
      type: 'line',
      data: applicationState.accelerationLowerLimit,
      yAxis: 3,
      visible: false,
      color: '#AFB42B',
    }, {
      name: 'Acceleration Standard Deviation',
      type: 'line',
      data: applicationState.accelerationStandardDeviation,
      yAxis: 3,
      visible: false,
      color: '#AFB42B',
    }, {
      name: 'Volume',
      type: 'line',
      data: applicationState.volume,
      yAxis: 4,
      visible: false,
      color: '#00E08E',
    }, {
      name: 'Volume Average',
      type: 'line',
      data: applicationState.volumeAverage,
      yAxis: 4,
      visible: false,
      color: '#00E08E',
    }, {
      name: 'Volume Upper Limit',
      type: 'line',
      data: applicationState.volumeUpperLimit,
      yAxis: 4,
      visible: false,
      color: '#00E08E',
    }, {
      name: 'Volume Lower Limit',
      type: 'line',
      data: applicationState.volumeLowerLimit,
      yAxis: 4,
      visible: false,
      color: '#00E08E',
    }]);
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};
