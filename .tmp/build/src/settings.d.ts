import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
export declare class Dropdown {
    showDropdown: any;
}
declare class DataPointCardSettings extends FormattingSettingsCard {
    showAllDataPoints: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class DataPointCardSettings2 extends FormattingSettingsCard {
    licenceValue: formattingSettings.TextInput;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class DataPointCardSettings3 extends FormattingSettingsCard {
    circleRepresentValue: formattingSettings.TextInput;
    lableXValue: formattingSettings.TextInput;
    lableYValue: formattingSettings.TextInput;
    defaultColor: formattingSettings.ColorPicker;
    leftColor: formattingSettings.ColorPicker;
    rightColor: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard: DataPointCardSettings;
    lice: DataPointCardSettings2;
    axisLabel: DataPointCardSettings3;
    cards: (DataPointCardSettings | DataPointCardSettings2 | DataPointCardSettings3)[];
}
export declare class VisualSettings extends DataViewObjectsParser {
    dropdown: Dropdown;
}
export {};
