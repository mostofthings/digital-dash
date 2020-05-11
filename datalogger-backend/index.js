const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const express = require('express');
const portString;
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

const tempRawData = [536, 546, 562, 578, 589, 604, 626, 646, 666, 685, 704, 712, 718, 729,
  734, 747, 759, 771, 785, 796, 807, 818, 828, 837, 848, 861, 870, 880, 886, 894, 898,
  905, 908, 914, 917, 920, 923, 926, 928, 929, 933, 937, 939, 941, 944, 946, 950, 952,
  955, 960, 964, 969, 974, 978];

const correspondingTemp = [80, 83, 86, 89, 91, 94, 98, 102, 106, 110, 114, 116, 117, 120,
  121, 124, 127, 130, 134, 137, 140, 144, 147, 150, 154, 159, 163, 167, 170, 174, 178,
  180, 182, 183, 185, 187, 188.5, 190, 192, 193, 195, 198, 199, 200, 203, 205, 209, 212,
  215, 220, 225, 230, 235, 240];


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
        const oilPSI = value;
        readingsToSend.oilPressure = oilPSI;
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
        const rpm = value;
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
    if (value < 536) {
      return 80
    } else if (value >= tempRawData[i] && value < tempRawData[i + 1]) {
      let sensorMax = tempRawData[i + 1];
      let sensorMin = tempRawData[i];
      let sensorRange = sensorMax - sensorMin;
      let differenceToReading = value - sensorMin;

      let percentile = differenceToReading / sensorRange;

      let responseMax = correspondingTemp[i + 1];
      let responseMin = correspondingTemp[i];
      let responseRange = responseMax - responseMin;

      return responseRange * percentile + responseMin;

    } else if (value > 977) {
      return 'error';
    }
  }
}