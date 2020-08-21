import { useEffect, useState } from 'react';

import formatApplicationExecutionState, { ApplicationState } from '../../formatters/formatApplicationExecutionState';
import formatDateTime from '../../formatters/formatDateTime';
import {
  Asset, Benchmark, BenchmarkOutput,
  DatesInterval,
} from '../../types';


type chartKeys = 'buys' | 'sells'

export function filterBenchmarkResultByTime(data: BenchmarkOutput, start: number | undefined, end: number | undefined) {
  const keys: chartKeys[] = ['buys', 'sells'];
  const newData: any = {};

  keys.forEach((key) => {
    if (!data[key]) {
      return;
    }

    let startIndex;
    let endIndex;

    if (data[key].length && start) {
      for (let i = 0; i < data[key].length; i++) {
        if (data[key][i][0] >= start) {
          startIndex = i;
          break;
        }
      }
    }

    if (data[key].length && end) {
      for (let i = data[key].length - 1; i >= 0; i--) {
        if (data[key][i][0] <= end) {
          endIndex = i;
          break;
        }
      }
    }

    if (startIndex !== undefined && endIndex !== undefined) {
      newData[key] = [...data[key].slice(startIndex, endIndex + 1)];
    }
  });

  return newData;
}

export const derivate = (ns: [number, number][], minutesBetweenPoints: number = 0): [number, number][] => {
  if (!ns.length) {
    return [];
  }
  if (ns.length === 1) {
    return ns;
  }

  return ns.slice(1).reduce((final: [number, number][], currentN: [number, number], index) => {
    const lastPoint = final[final.length - 1];

    if (lastPoint) {
      const change = currentN[1] - lastPoint[1];
      if (minutesBetweenPoints && (currentN[0] - lastPoint[0] < minutesBetweenPoints * 60 * 1000 && change < 20 && change > -20)) {
        return final;
      }
    }

    return [
      ...final,
      [currentN[0], currentN[1] - ns[index][1]],
    ];
  }, []);
};

export default (
  benchmark: Benchmark,
  datesInterval: DatesInterval | undefined,
  setDatesInterval: any,
  setMinDate: (date:Date|undefined)=>void,
  setMaxDate: (date:Date|undefined)=>void,
) => {
  const [assets, setAssets] = useState<Asset[]>();
  const [buys, setBuys] = useState<[number, number][]>();
  const [sells, setSells] = useState<[number, number][]>();
  const [applicationState, setApplicationState] = useState<ApplicationState>();

  useEffect(() => {
    if (benchmark && benchmark.output.buys && benchmark.output.sells) {
      const sellsDates = benchmark.output.sells.map((sell) => sell[0]);
      const buysDates = benchmark.output.buys.map((buy) => buy[0]);
      const firstBuy = Math.min(...buysDates);
      const firstSell = Math.min(...sellsDates);
      const lastBuy = Math.max(...buysDates);
      const lastSell = Math.max(...sellsDates);


      const startDate = firstBuy > firstSell ? firstSell : firstBuy;
      const endDate = lastBuy > lastSell ? lastBuy : lastSell;

      if (startDate && endDate && setDatesInterval) {
        setDatesInterval({ startDate: new Date(startDate), endDate: new Date(endDate) });
      }
    }

    if (benchmark) {
      setBuys(benchmark.output.buys.sort(([a], [b]) => a - b));
      setSells(benchmark.output.sells.sort(([a], [b]) => a - b));
      setAssets(benchmark.output.assets);
    }
  }, [benchmark, setDatesInterval]);

  useEffect(() => {
    if (datesInterval && benchmark) {
      const startDateFormatted = formatDateTime(datesInterval.startDate.getTime());
      const endDateFormatted = formatDateTime(datesInterval.endDate.getTime());

      fetch(`/api/benchmark/${benchmark._id}/state?startDate=${startDateFormatted}&endDate=${endDateFormatted}`)
        .then((res) => res.json())
        .then(formatApplicationExecutionState)
        .then((data) => ({
          price: data.price.sort((a, b) => a[0] - b[0]),
          priceAverage: data.priceAverage.sort((a, b) => a[0] - b[0]),
          priceStandardDeviation: data.priceStandardDeviation.sort((a, b) => a[0] - b[0]),
          priceUpperLimit: data.priceUpperLimit.sort((a, b) => a[0] - b[0]),
          priceLowerLimit: data.priceLowerLimit.sort((a, b) => a[0] - b[0]),

          change: data.change.sort((a, b) => a[0] - b[0]),
          changeAverage: data.changeAverage.sort((a, b) => a[0] - b[0]),
          changeStandardDeviation: data.changeStandardDeviation.sort((a, b) => a[0] - b[0]),
          changeUpperLimit: data.changeUpperLimit.sort((a, b) => a[0] - b[0]),
          changeLowerLimit: data.changeLowerLimit.sort((a, b) => a[0] - b[0]),

          acceleration: data.acceleration.sort((a, b) => a[0] - b[0]),
          accelerationAverage: data.accelerationAverage.sort((a, b) => a[0] - b[0]),
          accelerationStandardDeviation: data.accelerationStandardDeviation.sort((a, b) => a[0] - b[0]),
          accelerationUpperLimit: data.accelerationUpperLimit.sort((a, b) => a[0] - b[0]),
          accelerationLowerLimit: data.accelerationLowerLimit.sort((a, b) => a[0] - b[0]),

          accountAmount: data.accountAmount.sort((a, b) => a[0] - b[0]),
        }))
        .then((data) => {
          setApplicationState(data);
          if (data.accountAmount.length) {
            const minDate = new Date(+data.accountAmount[0][0]);
            const maxDate = new Date(+data.accountAmount[data.accountAmount.length - 1][0]);
            setMinDate(minDate);
            setMaxDate(maxDate);
          } else {
            setMinDate(undefined);
            setMaxDate(undefined);
          }
        });


      const data = filterBenchmarkResultByTime(
        benchmark.output,
        datesInterval.startDate.getTime(),
        datesInterval.endDate.getTime(),
      );

      setBuys(data.buys);
      setSells(data.sells);
    }
  }, [datesInterval, benchmark, setMinDate, setMaxDate]);


  return {
    buys,
    sells,
    assets,
    applicationState,
  };
};
