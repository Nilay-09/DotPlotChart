import powerbi from 'powerbi-visuals-api';
import ISelectionId = powerbi.visuals.ISelectionId;

export type Selection<T1, T2 = T1> = d3.Selection<any, T1, any, T2>;

export interface ILineChartRow {
    date?: Date | string,
    value: number,
    category: string,
    size: number,
    roles?:  Map<string, string>,
    tooltip?: ChartTooltip[],
    selectionId: ISelectionId;
    index?: number;
}

export interface CatRole {
    [key: string]: string
}

export interface Serie {
    name: string;
    value: number;
    category?: string;
}
  
export interface ChartData {
    name: string;
    series: ILineChartRow[];
}

export interface ChartTooltip {
    name: string;
    value: string | number;
}

export interface ITooltipEventArgs<TData> {
    data: TData;
    coordinates: number[];
    elementCoordinates: number[];
    context: HTMLElement;
    isTouchEvent: boolean;
}
