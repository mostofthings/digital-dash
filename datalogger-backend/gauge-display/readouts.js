export default class Readout {
    constructor(name, label) {
        this.name = name;
        this.label = label;

        const readoutContainer = document.getElementById('readouts-div');
        const newReadoutElement = document.createElement('div');
        newReadoutElement.id = `${this.name}`
        newReadoutElement.setAttribute('class', 'readout');
        this.element = newReadoutElement;
        readoutContainer.append(newReadoutElement);
        this.element.innerHTML = this.getScaffoldHtml();
        this.displayElement = document.getElementById(`${this.name}-display`);
    }

    getScaffoldHtml(){
        return `
        <div class="outline">
            <div id="${this.name}-display" class="number-display">
            
            </div>
            <div class="readout-label">
                ${this.label}
            </div>
        </div>
        <div class="color-corner" id="${this.name}-indicator">
        <div>
        `;
    }

    updateReadout(data){
        this.displayElement.innerText = data;
    }
}