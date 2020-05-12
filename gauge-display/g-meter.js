export default class Gmeter {

    constructor(name) {
        this.name = name;
        // this.xAccel = 0;
        // this.yAccel = 0;
        // this.zAccel = 0;
        this.y = 117;
        this.x = 117.5;
        
        const gmeterElement = document.createElement('div');
        gmeterElement.id = `gmeter-${name}`;
        gmeterElement.setAttribute('class', 'gmeter gauge-face');
        gmeterElement.innerHTML = this.getScaffoldHtml();
        const gaugeHolder = document.getElementById('gauge-div');
        gaugeHolder.append(gmeterElement);
        this.cursor = document.getElementById("cursor");
    }

    getScaffoldHtml() {
        return `
        <svg width="250" height="250" aria-label="A chart." style="overflow: hidden;">
        <defs id="_ABSTRACT_RENDERER_ID_3"></defs>
        <g>
            <circle cx="124.5" cy="124.5" r="113" stroke="#333333" stroke-width="1" fill="#cccccc"></circle>
            <circle cx="124.5" cy="124.5" r="101" stroke="#e0e0e0" stroke-width="2" fill="#f7f7f7" style="
            "></circle>
               </g>
        </svg>
                    <div id="meter-holder" class="gmeter">

            <div id="middle-ring" class="g-ring">
                <div id="inner-ring" class="g-ring">

                </div>
            </div>

        <div id="crosshairs-vertical" class="crosshairs"></div>
        <div id="crosshairs-horizontal" class="crosshairs"></div>
        <div class="label" id="half-g">.5G</div>
        <div class="label" id="one-g">1G</div></div>
        <div id="cursor"></div>
`;
    }

    updateGauge(xAccel, yAccel) {
        const tempY = (yAccel * 81) + this.y;
        const tempX = -1 * (xAccel * 81) + this.x;
        this.cursor.style.left = tempX + 'px';
        this.cursor.style.top = tempY + 'px';
    }
}