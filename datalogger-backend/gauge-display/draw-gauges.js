export default class Gauge {

  constructor(name, label, min, max, greenFrom, greenTo, yellowFrom, yellowTo, redFrom, redTo, majorTicks, minorTicks) {
    this.gauge = null;
    this.name = name;
    this.label = label;
    this.min = min;
    this.max = max;
    this.isSweepDone = false;
    
    const gaugeElement = document.createElement('div');
    gaugeElement.id = `gauge-${name}`;
    gaugeElement.setAttribute('class', 'gauge');
    const gaugeHolder = document.getElementById('gauge-div');
    gaugeHolder.append(gaugeElement)
    
    this.gaugeOptions = {
      width: 250, height: 250,
      max: max,
      min: min,
      redFrom: redFrom, redTo: redTo,
      yellowFrom: yellowFrom, yellowTo: yellowTo,
      greenFrom: greenFrom, greenTo: greenTo,
      majorTicks: majorTicks,
      minorTicks: minorTicks,
    };
        
    google.charts.load('current', { 'packages': ['gauge'] });
    google.charts.setOnLoadCallback(() => this.setupGauge());
  }
  
  setupGauge() {
    this.data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      [this.label, 0],
    ]);
    
	this.gauge = new google.visualization.Gauge(document.getElementById(`gauge-${this.name}`));
	
	this.data.setValue(0, 1, this.gaugeOptions.min);
    this.gauge.draw(this.data, this.gaugeOptions);
    
  }

  updateGauge(value){
    this.data.setValue(0, 1, value);
    this.gauge.draw(this.data, this.gaugeOptions);
  }

}
