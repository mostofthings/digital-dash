const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const portString = process.platform === 'win32' ? 'COM3' : '/dev/ttyACM0';

const port = new SerialPort(portString);
const app = express();
const server = app.listen(3000);
const socket = require('socket.io');
const io = socket(server);

app.use(express.static('gauge-display'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/gauge-display/index.html');
});

const parser = port.pipe(new Readline());
parser.on('data', sendSensorData);

io.sockets.on('connection', (socket) => console.log(socket.id));

const tempRawData = [16, 22, 29, 39, 51, 68, 90, 121, 162, 217, 291, 379, 483, 595, 708, 808, 884, 939];

const correspondingTemp = [302, 284, 266, 248, 230, 212, 194, 176, 158, 140, 122, 104, 86, 68, 50, 32, 14, -4];


function sendSensorData(data) {
  const allReadings = data.split(',');
  const readingsToSend = {};

  allReadings.forEach(reading => {
    const type = reading.substring(0, 2);
    const valueString = reading.substring(2);
    const value = parseInt(valueString);

    switch (type) {
      case 'WT':
        const unroundedTemp = getTempInF(value);
        readingsToSend.waterTemp = Math.round(unroundedTemp);
        break;
      case 'OP':
        const oilPSI = value * .18 - 18.75;
        readingsToSend.oilPressure = Math.round(oilPSI);
        break;
      case 'WB':
        const afr = value * .01161 + 7.312
        readingsToSend.wideband = afr.toFixed(1);
        break;
      case 'BP':
        const boost = value * 0.04451 - 14.45; //convert positive psi
        readingsToSend.boostPressure = boost.toFixed(1);
        break;
      case 'ER':
        const periodInSeconds = value * 2 / 1000000;
        const rpm = 60 / periodInSeconds;
        readingsToSend.rpm = rpm;
        break;
      case 'FP':
        const fuelPSI = value;
        readingsToSend.fuelPressure = fuelPSI;
        break;
      case 'XA':
        const xAccel = value / 100 / 9.806;
        readingsToSend.xAcceleration = xAccel.toFixed(2);
        break;
      case 'YA':
        const yAccel = value / 100 / 9.806;
        readingsToSend.yAcceleration = yAccel.toFixed(2);
        break;
      // default:
      //   console.log('sensor not found');
    }
  });

  readingsToSend.timestamp = new Date();

    io.emit('sensor', readingsToSend);
}

function getTempInF(value) {
  for (let i = 0; i < tempRawData.length - 1; i++) {
  if (value >= tempRawData[i] && value < tempRawData[i + 1]) {
      const sensorMax = tempRawData[i + 1];
      const sensorMin = tempRawData[i];
      const sensorRange = sensorMax - sensorMin;
      const differenceToReading = value - sensorMin;

      const percentile = differenceToReading / sensorRange;

      const responseMax = correspondingTemp[i + 1];
      const responseMin = correspondingTemp[i];
      const responseRange = responseMax - responseMin;

      return responseRange * percentile + responseMin;
    }
  }
}