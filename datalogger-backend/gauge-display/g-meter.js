export default class Gmeter {

    constructor(name) {
        this.name = name;
        // this.xAccel = 0;
        // this.yAccel = 0;
        // this.zAccel = 0;
        this.y = 76;
        this.x = 102;
        

        const gmeterElement = document.createElement('div');
        gmeterElement.id = `gmeter-${name}`;
        gmeterElement.setAttribute('class', 'gmeter');
        gmeterElement.innerHTML = this.getScaffoldHtml();
        const gaugeHolder = document.getElementById('gauge-div');
        gaugeHolder.append(gmeterElement);
        this.cursor = document.getElementById("cursor");


    }

    getScaffoldHtml() {
        return `
        <div id="meter-holder" class="gmeter">
            <div id="g-diameter" class="g-ring">
            <div id="middle-ring" class="g-ring">
                <div id="inner-ring" class="g-ring">

                </div>
            </div>
        </div>
        <div id="crosshairs-vertical" class="crosshairs"></div>
        <div id="crosshairs-horizontal" class="crosshairs"></div>
        <div class="label" id="half-g">.5G</div>
        <div class="label" id="one-g">1G</div></div>
        <div id="cursor"></div>`;
    }




    updateGauge(xAccel, yAccel) {
        const tempY = (yAccel * 81) + this.y;
        const tempX = -1 * (xAccel * 81) + this.x;


        this.cursor.style.left = tempX + 'px';
        this.cursor.style.top = tempY + 'px';
        console.log(this.y);
        console.log(this.x);
        console.log(yAccel);
        console.log(xAccel);
    }


}