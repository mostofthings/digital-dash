Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = 'Montserrat';
Chart.defaults.global.tooltips.enabled = false;
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.line.fill = false;
// Chart.defaults.global.animation.duration = 500;
Chart.defaults.global.hover.animationDuration = 0;
Chart.defaults.global.responsiveAnimationDuration = 0;

// const rollingWaterTemp = [];
// const rollingOilPressure = [];
// const rollingWideband = [];
// // const rollingFuelPressure = [];
// const rollingBoostPressure = [];
// const rollingRPM = [];
// const rollingGForce = [];
// const rollingTimestamp = [];

const xAxes = [{
    type: 'time',
    distribution: 'series',
    gridLines: {
        color: '#2e2e2e',
    },
    time: {
        displayFormats: {
            second: 'h:mm'
        },
        unit: 'second',
    },
    ticks: {
        maxTicksLimit: 8,
        maxRotation: 0,
        autoSkip: true,
    }
}];

const yAxes = [{
    id: 'deg',
    position: 'left',
    gridLines: {
        color: '#9c9c9c',
    },
    ticks: {
        max: 240,
        min: 0,
    }
}, {
    id: 'oil-psi',
    position: 'right',
    gridLines: {
        color: '#2e2e2e',
        borderDash: [2,8],
    },
    ticks: {
        max: 180,
        min: 0,
    }
}, {
    id: 'boost',
    gridLines: {
        color: '#2e2e2e',
        borderDash: [2,8],
    },
    display: false,
    ticks: {
        max: 14,
        min: -14,
    }
}, {
    id: 'afr',
    gridLines: {
        color: '#2e2e2e',
        borderDash: [2,8],
    },
    display: false,
    ticks: {
        max: 20,
        min: 8,
    }
}, {
    id: 'RPM',
    gridLines: {
        color: '#2e2e2e',
        borderDash: [2,8],
    },
    display: false,
    ticks: {
        max: 9000,
        min: 0,
    }
}, {
    id: 'Gs',
    gridLines: {
        color: '#2e2e2e',
        borderDash: [2,8],
    },
    display: false,
    ticks: {
        max: 2,
        min: 0,
    }
}];

const engineTempDataset = {
    label: 'Engine Temp',
    yAxisID: 'deg',
    data: [],
    showLine: true,
    borderColor: '#FF0061',
};

const oilPressureDataset = {
    label: 'Oil PSI',
    yAxisID: 'oil-psi',
    data: [],
    showLine: true,
    borderColor: '#FFAA00',
}

const boostPressureDataset = {
    label: 'Boost',
    yAxisID: 'boost',
    data: [],
    showLine: true,
    borderColor: '#8AE800',
}

const widebandDataset = {
    label: 'Wideband',
    yAxisID: 'afr',
    data: [],
    showLine: true,
    borderColor: '#7734EA',
}

const rpmDataset = {
    label: 'RPM',
    yAxisID: 'RPM',
    data: [],
    showLine: true,
    borderColor: '#00A7EA',
}

const gforceDataset = {
    label: 'G-force',
    yAxisID: 'Gs',
    data: [],
    showLine: true,
    borderColor: '#949494',
}

const chartData = {
    datasets: [engineTempDataset, oilPressureDataset, boostPressureDataset, widebandDataset, rpmDataset, gforceDataset]
}

export { xAxes, yAxes, chartData, engineTempDataset, oilPressureDataset, boostPressureDataset, widebandDataset, rpmDataset, gforceDataset }