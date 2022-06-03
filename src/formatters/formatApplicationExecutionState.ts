export interface ApplicationStateAggregatedByDate {
  _id: {
    day: number;
    month: number;
    year: number;
    hour?: number;
    minute?: number;
  };
  price: number;
  priceAverage: number;
  priceStandardDeviation: number;
  priceUpperLimit: number;
  priceLowerLimit: number;

  change: number;
  changeAverage: number;
  changeStandardDeviation: number;
  changeUpperLimit: number;
  changeLowerLimit: number;

  acceleration: number;
  accelerationAverage: number;
  accelerationStandardDeviation: number;
  accelerationUpperLimit: number;
  accelerationLowerLimit: number;

  volume: number;
  volumeAverage: number;
  volumeUpperLimit: number;
  volumeLowerLimit: number;

  accountAmount: number;
}

export interface ApplicationState {
  price: [number, number][]
  priceAverage: [number, number][]
  priceStandardDeviation: [number, number][]
  priceUpperLimit: [number, number][]
  priceLowerLimit: [number, number][]

  change: [number, number][]
  changeAverage: [number, number][]
  changeStandardDeviation: [number, number][]
  changeUpperLimit: [number, number][]
  changeLowerLimit: [number, number][]

  acceleration: [number, number][]
  accelerationAverage: [number, number][]
  accelerationStandardDeviation: [number, number][]
  accelerationUpperLimit: [number, number][]
  accelerationLowerLimit: [number, number][]

  volume: [number, number][]
  volumeAverage: [number, number][];
  volumeUpperLimit: [number, number][];
  volumeLowerLimit: [number, number][];

  accountAmount: [number, number][]
}

export default (data: ApplicationStateAggregatedByDate[]): ApplicationState => {
  const defaultResult: ApplicationState = {
    price: [],
    priceAverage: [],
    priceStandardDeviation: [],
    priceUpperLimit: [],
    priceLowerLimit: [],

    change: [],
    changeAverage: [],
    changeStandardDeviation: [],
    changeUpperLimit: [],
    changeLowerLimit: [],

    acceleration: [],
    accelerationAverage: [],
    accelerationStandardDeviation: [],
    accelerationUpperLimit: [],
    accelerationLowerLimit: [],

    volume: [],
    volumeAverage: [],
    volumeUpperLimit: [],
    volumeLowerLimit: [],

    accountAmount: [],
  };

  return data
    ? data
      .reduce(
        (final, applicationState) => {
          const time = Date.UTC(
            applicationState._id.year,
            applicationState._id.month - 1,
            applicationState._id.day,
            applicationState._id.hour || 0,
            applicationState._id.minute || 0,
          );

          final.price.push([time, applicationState.price]);
          final.priceAverage.push([time, applicationState.priceAverage]);
          final.priceStandardDeviation.push([time, applicationState.priceStandardDeviation]);
          final.priceUpperLimit.push([time, applicationState.priceUpperLimit]);
          final.priceLowerLimit.push([time, applicationState.priceLowerLimit]);

          final.change.push([time, applicationState.change]);
          final.changeAverage.push([time, applicationState.changeAverage]);
          final.changeStandardDeviation.push([time, applicationState.changeStandardDeviation]);
          final.changeUpperLimit.push([time, applicationState.changeUpperLimit]);
          final.changeLowerLimit.push([time, applicationState.changeLowerLimit]);

          final.acceleration.push([time, applicationState.acceleration]);
          final.accelerationAverage.push([time, applicationState.accelerationAverage]);
          final.accelerationStandardDeviation.push([time, applicationState.accelerationStandardDeviation]);
          final.accelerationUpperLimit.push([time, applicationState.accelerationUpperLimit]);
          final.accelerationLowerLimit.push([time, applicationState.accelerationLowerLimit]);

          final.volume.push([time, applicationState.volume]);
          final.volumeAverage.push([time, applicationState.volumeAverage]);
          final.volumeUpperLimit.push([time, applicationState.volumeUpperLimit]);
          final.volumeLowerLimit.push([time, applicationState.volumeLowerLimit]);

          final.accountAmount.push([time, applicationState.accountAmount]);

          return final;
        }, defaultResult,
      )
    : defaultResult;
};
