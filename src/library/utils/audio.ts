import { Readable } from "stream";

export async function getCurrentNoiseLevel(
  durationMS: number
): Promise<number> {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  const samples: number[] = [];

  const sampleInterval = 100; // Adjust this value to change the sampling rate

  const sampleNoiseLevel = () => {
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }

    const average = sum / dataArray.length;
    samples.push(average);
  };

  // Start sampling noise level
  const intervalId = setInterval(sampleNoiseLevel, sampleInterval);

  // Stop sampling after the specified duration and compute the average
  return await new Promise<number>((resolve) => {
    setTimeout(() => {
      clearInterval(intervalId);
      stream.getTracks().forEach((track) => track.stop()); // Stop the audio stream

      const overallAverage =
        samples.reduce((sum, value) => sum + value, 0) / samples.length;
      resolve(overallAverage);
    }, durationMS);
  });
}

export const average = (arr: number[]) =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

export const getSilenceThresholdFromSeries = (
  series: number[],
  thresholdFactor = 0.25
) => {
  const average = series.reduce((a, b) => a + b, 0) / series.length;
  return average * thresholdFactor;
};

function roundToNDecimalPlaces(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

function getQueue(arr: number[], maxLength: number) {
  if (arr.length > maxLength) {
    return arr.slice(-maxLength);
  }
  return arr;
}

export const createAudioDataStream = (sampleMS = 500, publishMS = 500) => {
  const exists = (
    window as unknown as {
      audioDataStreamCreated: boolean;
    }
  ).audioDataStreamCreated;

  if (exists) {
    return {
      datastream: null,
      kill: () => {},
    };
  }
  (
    window as unknown as {
      audioDataStreamCreated: boolean;
    }
  ).audioDataStreamCreated = true;
  const datastream = new Readable({
    read() {},
    objectMode: true,
  });

  const SILENCE_FACTOR = 0.25;

  let readings: number[] = [];

  setInterval(async () => {
    const currentNoiseLevel = await getCurrentNoiseLevel(sampleMS);
    readings.push(currentNoiseLevel);
  }, sampleMS);

  const interval = setInterval(() => {
    const avgNoiseLevel = readings.length
      ? roundToNDecimalPlaces(average(readings), 2)
      : 0;
    const threshold = roundToNDecimalPlaces(avgNoiseLevel * SILENCE_FACTOR, 2);
    readings = getQueue(readings, 5);
    datastream.push({
      average_noise_level: avgNoiseLevel,
      silence_theshold: threshold,
    });
  }, publishMS);

  return { datastream, kill: () => clearInterval(interval) };
};
