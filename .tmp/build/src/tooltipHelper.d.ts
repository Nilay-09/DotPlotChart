import { ITooltipServiceWrapper } from "powerbi-visuals-utils-tooltiputils";
import ITooltipService = powerbi.extensibility.ITooltipService;
import { Selection } from "./line-chart.model";
import powerbi from 'powerbi-visuals-api';
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
export declare class TooltipHelper {
    private handleTouchTimeoutId;
    private visualHostTooltipService;
    private rootElement;
    private handleTouchDelay;
    static tooltipServiceWrapper: ITooltipServiceWrapper;
    constructor(tooltipService: ITooltipService, rootElement: Element, handleTouchDelay: number);
    static renderTooltip(selection: Selection<any>, flag: number): void;
    static getTooltipData(value: any): VisualTooltipDataItem[];
    static createTooltipWrapper(host: IVisualHost, options: VisualConstructorOptions): void;
}
