const tempRawData = [536, 546, 562, 578, 589, 604, 626, 646, 666, 685, 704, 712, 718, 729,
    734, 747, 759, 771, 785, 796, 807, 818, 828, 837, 848, 861, 870, 880, 886, 894, 898,
    905, 908, 914, 917, 920, 923, 926, 928, 929, 933, 937, 939, 941, 944, 946, 950, 952,
    955, 960, 964, 969, 974, 978];

const correspondingTemp = [80, 83, 86, 89, 91, 94, 98, 102, 106, 110, 114, 116, 117, 120,
    121, 124, 127, 130, 134, 137, 140, 144, 147, 150, 154, 159, 163, 167, 170, 174, 178,
    180, 182, 183, 185, 187, 188.5, 190, 192, 193, 195, 198, 199, 200, 203, 205, 209, 212,
    215, 220, 225, 230, 235, 240];


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