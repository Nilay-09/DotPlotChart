import { ITooltipServiceWrapper,TooltipEventArgs, createTooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import ITooltipService = powerbi.extensibility.ITooltipService;
import { ILineChartRow, Selection } from "./line-chart.model";
import powerbi from 'powerbi-visuals-api';
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;

export class TooltipHelper {
    private handleTouchTimeoutId: number;
    private visualHostTooltipService: ITooltipService;
    private rootElement: Element;
    private handleTouchDelay: number;
    public static tooltipServiceWrapper: ITooltipServiceWrapper;
    constructor(tooltipService: ITooltipService, rootElement: Element, handleTouchDelay: number) {
        this.visualHostTooltipService = tooltipService;
        this.handleTouchDelay = handleTouchDelay;
        this.rootElement = rootElement;
        
    }  
    public static renderTooltip(selection: Selection<any>,flag:number): void {
        // console.log("selection ",selection);
           TooltipHelper.tooltipServiceWrapper.addTooltip(
               selection,
               (datapoint: any) => TooltipHelper.getTooltipData(datapoint),
               (tooltipEvent: any) => tooltipEvent?.selectionId)
       }
   
       public static getTooltipData(value: any): VisualTooltipDataItem[] {
        var data : any []=[];
        // debugger;
        if(value && value.tooltipInfo && value.tooltipInfo.length >  0){
            var tpData = value.tooltipInfo;
            for (var i = 0; i < tpData.length; i++) {
                    var nme = tpData[i].displayName;
                    data.push(tpData[i].displayName+":"+tpData[i].value);
            }}

        return data;
       }
       public static createTooltipWrapper(host: IVisualHost, options: VisualConstructorOptions) {
        TooltipHelper.tooltipServiceWrapper = createTooltipServiceWrapper(host.tooltipService, options.element);
    }

}