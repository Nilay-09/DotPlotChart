"use strict";

import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import { TooltipHelper } from './tooltipHelper';//vishnu
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import { Selection, select} from "d3";

import { VisualFormattingSettingsModel } from "./settings";


import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";



import * as d3 from 'd3';
import { ITooltipServiceWrapper, createTooltipServiceWrapper,TooltipEventArgs,TooltipEnabledDataPoint  } from "powerbi-visuals-utils-tooltiputils";//vishnu


export class Visual implements IVisual {

    private tooltipServiceWrapper: ITooltipServiceWrapper;//vishnu
    private tooltip: any; //Vishnu
     private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private host: IVisualHost;
    private svg: Selection<SVGElement, any, any, any>;
    private pieContainer: Selection<SVGGElement, any, any, any>;
    private barContainer: Selection<SVGGElement, any, any, any>;
    private freeDiv: Selection<HTMLDivElement, any, any, any>;
    private premDiv: Selection<HTMLDivElement, any, any, any>;
    private selectorDiv: Selection<HTMLDivElement, any, any, any>;
    private legendDiv: Selection<HTMLDivElement, any, any, any>;
    private selectorWrapper: Selection<HTMLDivElement, any, any, any>;


    private dropdownContainer: HTMLDivElement;

    private rangeContainer: HTMLDivElement;
    private rangeInput: any;
    private selectedValueDisplay: HTMLSpanElement;

    private dropdownSkel: HTMLSelectElement;

    private ValueContainer: HTMLDivElement;
    private valueDropdown: HTMLSelectElement;

    private selectedIndex: number = 0;
    private selectedRangeNumber: number = 50;
    private selectedValueIndex: number = 0;

    private LicenseKey = 'KhulJaaSimSim';

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.tooltipServiceWrapper = createTooltipServiceWrapper(this.host.tooltipService, options.element[0]);//vishnu
   
        this.freeDiv = select(options.element)
            .append('div')
            .classed('free-trial', true)
            .html(`
        <div class="wrapper">
        <div class="licence-img"></div> 
        </div>
    `);



        this.selectorWrapper = select(options.element)
            .append('div')
            .classed('selectorWrapper', true)
            .style('display', 'flex');

        this.legendDiv = select('.selectorWrapper')
            .append('div')
            .classed('legendDiv', true)
            .style('display', 'flex');

        this.selectorDiv = select('.selectorWrapper')
            .append('div')
            .classed('selectorDiv', true)
            .style('display', 'flex');

        this.premDiv = select(options.element)
            .append('div')
            .classed('premium', true)
            .style('display', 'block');



        this.svg = this.premDiv.append('svg');

        this.barContainer = this.svg.append('g').classed('bar-container', true);


        this.formattingSettingsService = new FormattingSettingsService();

        // dropdownSkel
        this.dropdownContainer = document.createElement('div');
        this.dropdownContainer.classList.add('x-holder');


        // Add a label
        var xAxisLabel = document.createElement('label');
        // xAxisLabel.textContent = 'X axis';
        xAxisLabel.style.marginRight = '5px';
        xAxisLabel.classList.add('x-axis-label');

        this.dropdownSkel = document.createElement('select');

        this.dropdownContainer.appendChild(xAxisLabel);
        this.dropdownContainer.appendChild(this.dropdownSkel);
        this.selectorDiv.node().appendChild(this.dropdownContainer);





        // 
        this.ValueContainer = document.createElement('div');
        this.ValueContainer.classList.add('y-holder');

        // Add a label
        var yAxisLabel = document.createElement('label');
        yAxisLabel.style.marginRight = '4px';
        yAxisLabel.classList.add('y-axis-label');

        this.valueDropdown = document.createElement('select');

        this.ValueContainer.appendChild(yAxisLabel);
        this.ValueContainer.appendChild(this.valueDropdown);
        this.selectorDiv.node().appendChild(this.ValueContainer);






        // Create a range input
        this.rangeContainer = document.createElement('div');
        this.rangeContainer.classList.add('z-holder');

        this.rangeContainer.style.width = "180px";

        // Create a label for the range selector
        const rangeLabel = document.createElement('label');
        rangeLabel.style.marginRight = '4px';
        rangeLabel.textContent = 'Quantiles';

        // Create the range input
        this.rangeInput = document.createElement('input');
        this.rangeInput.type = 'range';
        this.rangeInput.min = 20;
        this.rangeInput.value = 50;
        this.rangeInput.max = 100;
        this.rangeInput.style.width = '100px';
        this.rangeInput.classList.add('range-input');

        // Create a span element to display the selected value
        this.selectedValueDisplay = document.createElement('span');
        this.selectedValueDisplay.classList.add('range-label');

        // Add an event listener to update the displayed value when the range input changes
        this.rangeInput.addEventListener('input', () => {
            this.selectedRangeNumber = this.rangeInput.value || 50;
            this.selectedValueDisplay.textContent = `${this.selectedRangeNumber}`;
        });

        // Append the label, range input, and span elements to the range container
        this.rangeContainer.appendChild(rangeLabel);
        this.rangeContainer.appendChild(this.rangeInput);

        // Append the range container to the main element
        this.selectorDiv.node().appendChild(this.rangeContainer);
        this.selectorDiv.node().appendChild(this.selectedValueDisplay);
        this.selectorDiv.data([{
            tooltipInfo: [{
                displayName: "Power BI",
                value: 2016
            }]
        }]);

        TooltipHelper.createTooltipWrapper(this.host, options);//vishnu
        this.tooltip = this.selectorDiv.append("div").attr("class", "toolTipBarTree").text("Hello tool tip.");//vishnu
        TooltipHelper.renderTooltip(this.selectorDiv,1);//vishnu
        TooltipHelper.renderTooltip(d3.selectAll('.parentTr .valueTDCls:not(.totalTDCls):not(.totalTDPEPCls) div'), 0);
        TooltipHelper.renderTooltip(d3.selectAll('svg.circle'), 0);
     
    }
    

    
    public update(options: VisualUpdateOptions) {


        const width = options.viewport.width;
        const height = options.viewport.height;

        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        this.rangeInput.max = 20;

        const encryptionKey = "abracadabra";

        const cipher = salt => {
            const textToChars = text => text.split('').map(c => c.charCodeAt(0));
            const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
            const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

            return text => text.split('')
                .map(textToChars)
                .map(applySaltToChar)
                .map(byteHex)
                .join('');
        }

        const decipher = salt => {
            const textToChars = text => text.split('').map(c => c.charCodeAt(0));
            const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
            return encoded => encoded.match(/.{1,2}/g)
                .map(hex => parseInt(hex, 16))
                .map(applySaltToChar)
                .map(charCode => String.fromCharCode(charCode))
                .join('');
        }

        var myDecipher = decipher(encryptionKey)

        const validLicenses =
            [
                "545654524b56544b5452",
                "545654524b56544b5451",
                "545654524b56554b565f",
                "545654524b56554b5452",
                "545654524b56534b5452",
                "545654524b565e4b5452",
                "545654534b56544b5452",
                "KhulJaaSimSim",
            ];
        const lic = this.formattingSettings.lice.licenceValue.value;

        if (validLicenses.includes(lic) || lic == this.LicenseKey) {
            const date = myDecipher(lic);
            console.log(date, lic);

            if (new Date(date) > new Date() || lic == this.LicenseKey) {
                console.log("Here");
                this.rangeContainer.style.display = this.selectedValueDisplay.style.display = 'block';
                this.freeDiv.style('display', 'none');
            } else {
                console.log("There");
                this.freeDiv.style('display', 'block');
                this.rangeContainer.style.display = this.selectedValueDisplay.style.display = 'none';
            }
        } else {
            console.log("There");
            this.freeDiv.style('display', 'block');
            this.rangeContainer.style.display = this.selectedValueDisplay.style.display = 'none';
        }



        this.dropdownSkel.addEventListener('change', () => this.onDropdownChange(options));
        this.valueDropdown.addEventListener('change', () => this.onDropdownChange(options));



        this.rangeInput.onchange = () => {
            this.populateDropdown(options);
            this.populateValue(options);
            this.selectedRangeNumber = this.rangeInput.value;
            this.createHistogramChart(updatedData, options);
        };

        var customXLableValue = this.formattingSettings.axisLabel.lableXValue.value
        if (customXLableValue !== "" && customXLableValue !== undefined) {
            d3.select('.x-axis-label').text(customXLableValue);
        } else {
            d3.select('.x-axis-label').text("X axis");
        }

        var customYLableValue = this.formattingSettings.axisLabel.lableYValue.value


        if (customYLableValue !== "" && customYLableValue !== undefined) {
            d3.select('.y-axis-label').text(customYLableValue);
        } else {
            d3.select('.y-axis-label').text("Y axis");
        }

        this.svg
            .attr('width', width)
            .attr('height', height);

        // Access dataViews in the update method
        const updatedData = this.extractData(options, this.selectedIndex, this.selectedValueIndex);

        console.log(updatedData)
        this.rangeInput.max = updatedData.length;

        this.createHistogramChart(updatedData, options);

        // Populate dropdownSkel in the update method
        this.populateDropdown(options);
        this.populateValue(options);


       // this.tooltip = this.selectorDiv.append("div").attr("class", "toolTipBarTree").text(this.rangeInput.max );//vishnu
        //TooltipHelper.createTooltipWrapper(this.host, options);//vishnu


        this.tooltip = this.selectorDiv.append("div").attr("class", "toolTipBarTree").text("Hello tool tip.");//vishnu
        this.tooltip=TooltipHelper.renderTooltip(this.barContainer,1);//vishnu
    }




    private createHistogramChart(data: any[], options: VisualUpdateOptions): void {
        // Remove existing SVG content
        d3.select('.bar-container svg').remove();

        data.sort((a, b) => +a.category - +b.category);

        data = data.slice(0, this.selectedRangeNumber);
        const categories = data.map(d => +d.category);
        const values = data.map(d => d.value);

        const width = options.viewport.width * 0.93;
        const height = options.viewport.height * 0.84;

        const margin = { top: 0, right: 0, bottom: 20, left: 50 };

        const x = d3.scaleBand()
            .domain(categories.map(String))
            .range([0, width])
            .padding(0.1);

        const xAxis = d3.axisBottom(x)
            .tickFormat((domainValue: string) => d3.format('.0f')(parseFloat(domainValue)));

        const y = d3.scaleLinear()
            .domain([0, d3.max(values) || 1])
            .range([height, 0]);

        const thresholdCategory = 0.4 * d3.max(categories);
        const closestCategory = categories.reduce((prev, curr) =>
            Math.abs(curr - thresholdCategory) < Math.abs(prev - thresholdCategory) ? curr : prev
        );

        const svg = d3.select('.bar-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Draw circles with red or blue color based on the position relative to the red line

        let fillLeft = this.formattingSettings.axisLabel.leftColor.value.value || '#FF5C5C';
        let fillRight = this.formattingSettings.axisLabel.rightColor.value.value || '#5B8DEF';

        let circleRep = Number(this.formattingSettings.axisLabel.circleRepresentValue.value) || 2000;

        data.forEach((d) => {
            const circleCount = Math.ceil(d.value / circleRep);
            const startY = height - 12;

            let circleRadius = this.formattingSettings.axisLabel.fontSize.value;
            for (let i = 0; i < circleCount; i++) {
                const isRightSide = +d.category > closestCategory;
                const fillColor = !isRightSide ? fillLeft : fillRight;

                svg.append('circle')
                    .attr('cx', x(String(+d.category)) + x.bandwidth() / 2)
                    .attr('cy', startY - i * 20)
                    .attr('r', circleRadius)
                    .attr('fill', fillColor)
                    .style('opacity', 0.9)
                    .transition()
                    .duration(800)
                    .style('opacity', 1)
                    .ease(d3.easeBounce); 
            }
        });


        // Draw x-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis as any);

        // Draw y-axis
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        const fillAverage = this.formattingSettings.axisLabel.defaultColor.value.value || '#ff0000';

        // Draw red line
        svg.append('line')
            .attr('x1', x(String(closestCategory)))
            .attr('y1', 0)
            .attr('x2', x(String(closestCategory)))
            .attr('y2', height)
            .attr('stroke', fillAverage)
            .attr('stroke-width', 2);

        // Style the axes
        svg.selectAll('.axis line, .axis path')
            .style('stroke', '#ddd')
            .style('stroke-width', '1px')
            .style('fill', 'none');



        // Update or create the legend
        this.legendDiv.html('');

        const existingLegend = this.legendDiv.select('.legend');

        const legendSize = 20;
        const legendText = `1 Circle( `;
        const legendVariable = `)=${circleRep}`

        if (existingLegend.empty()) {
            // If the legend doesn't exist, create a new one

            const legendDiv = this.legendDiv.append('div')
                .classed('legend', true);

            legendDiv.append('span')
                .style('font-size', '16px')
                .text(legendText)
                .classed('legend-text', true);

            // Append a circle to the legend div

            legendDiv.append('div')
                .style('width', `${legendSize}px`)
                .style('height', `${legendSize}px`)
                .style('border-radius', '50%')
                .style('background-color', fillLeft)
                .style('display', 'flex')
                .classed('legend-leftCircle', true);

            legendDiv.append('div')
                .style('width', `${legendSize}px`)
                .style('height', `${legendSize}px`)
                .style('border-radius', '50%')
                .style('background-color', fillRight)
                .style('display', 'flex')
                .classed('legend-rightCircle', true);

            legendDiv.append('span')
                .style('font-size', '16px')
                .text(legendVariable)
                .classed('legend-text', true);


        } else {
            // If the legend exists, update its content
            existingLegend.select('.legend-text').text(legendText);
            existingLegend.select('.legend-leftCircle').style('background-color', fillLeft);
            existingLegend.select('.legend-rightCircle').style('background-color', fillRight);
        }



    }



    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    private populateDropdown(options: VisualUpdateOptions): void {
        this.dropdownSkel.innerHTML = ''; // Clear existing options

        if (options.dataViews && options.dataViews[0] && options.dataViews[0].categorical) {
            const ListingData = options.dataViews[0].categorical;

            for (let n = 0; n < ListingData.categories.length; n++) {
                const category = ListingData.categories[n];

                const option = document.createElement('option');
                option.value = category.source.displayName;
                option.text = category.source.displayName;

                // Set the selected attribute if the index matches the selected index
                if (n === this.selectedIndex) {
                    option.selected = true;
                }

                this.dropdownSkel.add(option);
            }
        }
    }



    // // Value
    private populateValue(options: VisualUpdateOptions): void {
        this.valueDropdown.innerHTML = ''; // Clear existing options

        if (options.dataViews && options.dataViews[0] && options.dataViews[0].categorical) {
            const ListingData = options.dataViews[0].categorical;

            for (let n = 0; n < ListingData.values.length; n++) {
                const category = ListingData.values[n];

                const option = document.createElement('option');
                option.value = category.source.displayName;
                option.text = category.source.displayName;

                // Set the selected attribute if the index matches the selected index
                if (n === this.selectedValueIndex) {
                    option.selected = true;
                }

                this.valueDropdown.add(option);
            }
        }
    }


    private extractData(options: VisualUpdateOptions, i: number, val: number): any[] {
        const extractedData = [];

        if (options.dataViews && options.dataViews[0]
            && options.dataViews[0].categorical) {

            const ListingData = options.dataViews[0].categorical;

            const category = ListingData.categories[i];
            const dataValue = ListingData.values[val];

            for (let i = 0; i < category.values.length; i++) {
                const existingCategoryIndex = extractedData.findIndex(item => item.category === category.values[i]);

                if (existingCategoryIndex !== -1) {
                    // Category already exists, update the value
                    extractedData[existingCategoryIndex].value += dataValue.values[i];
                } else {
                    // Category doesn't exist, add a new entry
                    extractedData.push({
                        category: category.values[i],
                        value: dataValue.values[i],
                        color: this.host.colorPalette.getColor(category.values[i] as string).value,
                    });
                }
            }
        }


        return extractedData;
    }


    private onDropdownChange(options: VisualUpdateOptions): void {

        this.selectedIndex = this.dropdownSkel.selectedIndex;
        this.selectedValueIndex = this.valueDropdown.selectedIndex;
        window.dispatchEvent(new Event('resize'));
        const updatedData = this.extractData(options, this.selectedIndex, this.selectedValueIndex);
        this.createHistogramChart(updatedData, options);
        this.update(options);

    }

}

