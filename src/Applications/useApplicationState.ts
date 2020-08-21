import { useEffect, useState } from 'react';

import formatApplicationExecutionState, { ApplicationState } from '../formatters/formatApplicationExecutionState';
import formatDateTime from '../formatters/formatDateTime';

export default (appID: string, startDate: Date, endDate: Date) => {
  const [applicationState, setApplicationState] = useState<ApplicationState>();

  useEffect(() => {
    if (appID && startDate && endDate) {
      const startDateFormatted = formatDateTime(startDate.getTime());
      const endDateFormatted = formatDateTime(endDate.getTime());

      fetch(`/api/applications/${appID}/state?startDate=${startDateFormatted}&endDate=${endDateFormatted}`)
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
        .then(setApplicationState);
    } else {
      setApplicationState(undefined);
    }
  }, [appID, startDate, endDate]);

  return {
    applicationState,
  };
};
