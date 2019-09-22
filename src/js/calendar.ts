import renderer from './renderer';

interface correctParams {
    day?: number;
    month?: number;
    year?: number;
    decs?: number;
}

const openerInnerHTML = `
<style>
    button {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: #84acdd;
        box-sizing: content-box;
        padding: 0;
        -webkit-appearance: none;
        border: none;
    }
    
    .calendar {
        position: absolute;
        margin-left: 10px;
        padding-left: 6px;
        padding-right: 6px;
        width: 180px;
        height: 205px;
        border: 1px solid #ccc;
        border-radius: 7px;
        box-shadow: 0 10px 15px #ccc;
        z-index: 1000;
        background: #fff;
    }

    .opener-calendar {
        display: inline-block;
        height: 20px;
        width: 20px;
        line-height: 20px;
        margin-top: 1px;
        margin-left: 5px;
        text-align: center;
        background: #000;
    }

    .wrap-selected-date {
        text-align: center;
    }

    .selected-date {
        font-family: Helvetica, sans-serif;
        display: inline-block;
        width: 150px;
        color: #2b66dd;
        font-size: 14px;
        cursor: pointer;
        margin-top: 2px;
        height: 25px;
    }

    .wrap-weekdays {
        margin: 0;
        padding: 0;
    }

    .weekday {
        font-family: Helvetica, sans-serif;
        padding: 0;
        margin: 0 0 0 2px;
        width: 23px;
        height: 23px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        vertical-align: bottom;
    }

    .day-another {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        color: #ccc;
        margin: 0;
        width: 23px;
        height: 23px;
        line-height: 23px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        vertical-align: middle;
    }

    .day {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        margin: 0;
        width: 23px;
        height: 23px;
        line-height: 23px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        cursor: pointer;
        vertical-align: middle;
    }

    .day-wrap {

    }

    .month {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        margin: 0;
        width: 42px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        cursor: pointer;
        vertical-align: middle;
}

    .month-wrap {
        /*margin-top: 20px;*/
    }

    .year {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        margin: 0;
        width: 42px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        cursor: pointer;
        vertical-align: middle;
}

    .year-wrap {
        /*margin-top: 20px;*/
    }

    .year-another {
        font-family: Helvetica, sans-serif;
        color: #ccc;
        margin: 0;
        width: 42px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        text-align: center;
        font-size: 13px;
        vertical-align: middle;
    }

    .decs {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        margin: 0;
        width: 42px;
        height: 40px;
        line-height: 20px;
        display: inline-block;
        text-align: left;
        font-size: 13px;
        cursor: pointer;
        vertical-align: middle;
    }

    .decs-wrap {
        /*margin-top: 25px;*/
        padding-left: 4px;
    }

    .decs-another {
        font-family: Helvetica, sans-serif;
        border: 1px solid #fff;
        color: #ccc;
        margin: 0;
        width: 42px;
        height: 40px;
        line-height: 20px;
        display: inline-block;
        text-align: left;
        font-size: 13px;
        vertical-align: middle;
    }

    .hover {
        border: 1px solid #b9d7fc;
        border-radius: 5px;
        background: linear-gradient(top, #fdfeff, #edf5ff);
    }

    .selected {
        border: 1px dotted #84acdd;
        border-radius: 5px;
        background: linear-gradient(top, #ebf4ff, #d1e6ff);
    }

    .warning {
        color: #ef3124;
    }

    .line {
        color: #ccc;
        margin-bottom: 2px;
        margin-top: -5px;
    }

    .move-left {
        display: inline-block;
        position: absolute;
        left: 0;
        color: #2b66dd;
        cursor: pointer;
        height: 25px;
        width: 25px;
    }

    .move-left:hover {
        border: 1px solid #b9d7fc;
        border-top-left-radius: 5px;
        background: linear-gradient(top, #fdfeff, #edf5ff);
    }

    .move-right {
        display: inline-block;
        position: absolute;
        right: 0;
        color: #2b66dd;
        cursor: pointer;
        height: 25px;
        width: 25px;
    }

    .move-right:hover {
        border: 1px solid #b9d7fc;
        border-top-right-radius: 5px;
        background: linear-gradient(top, #fdfeff, #edf5ff);
    }
</style>
<button></button>
`;

export default class Calendar extends HTMLElement {
    private openerTemplate: HTMLElement;

    private renderer: renderer;

    private calendarElement: HTMLElement;

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });


        this.renderer = new renderer(this);

        this.openerTemplate = document.createElement('template');
        this.openerTemplate.innerHTML = openerInnerHTML;

        this.shadowRoot.appendChild((this.openerTemplate as HTMLTemplateElement).content.cloneNode(true));
        this.shadowRoot.querySelector('button').addEventListener('click', this.toggle.bind(this));

        // this.input = object.input;
        // this.calendar = object.calendar;
        // this.dateFrom = new Date(1920, 0, 3);
        // this.dateTo = new Date(2030, 11, 1);
        // this.dateCurrent = new Date();
        // this.htmlGenerator = new HtmlGenerator(this);
        // this.levelCode = 0;
        // this.levels = {0: 'days', 1: 'months', 2: 'years', 3: 'decs' };
        // this.selectedDay = this.dateCurrent.getDate();
        // this.selectedMonth = this.dateCurrent.getMonth();
        // this.selectedYear = this.dateCurrent.getFullYear();
        // this.previousSelected = undefined;
    }

    get dateCurrent(): Date {
        return new Date();
    }

    get selectedMonth(): number {
        return 0;
    }

    get selectedYear(): number {
        return 0;
    }

    isCorrect(params: correctParams): boolean {
        return true;
    }

    getDate(): Date {
        return new Date();
    }

    toggle() {
        if (this.calendarElement) {
            this.shadowRoot.removeChild(this.calendarElement);
            this.calendarElement = null;
            return
        }

        this.calendarElement = this.render();
        this.shadowRoot.appendChild(this.calendarElement);
    }

    render() {
        let html = this.renderer.getDays();

        if (arguments.length !== 0)
        {
            switch (arguments[0]) {
                case 'days':
                    html = this.renderer.getDays();
                    // if (arguments[1] == 'down')
                    //     this.calendar.animate({
                    //         height: '+=40px'
                    //     }, 100);
                    break;
                case 'months':
                    html = this.renderer.getMonths();
                    // if (arguments[1] == 'up')
                    //     this.calendar.animate({
                    //         height: '-=40px'
                    //     }, 100);
                    break;
                case 'years': html = this.renderer.getYears(); break;
                case 'decs': html = this.renderer.getDecs(); break;
            }
        }

        return html;
    }
}

window.customElements.define('w-calendar', Calendar);
