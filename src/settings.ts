
"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class Dropdown {
    public showDropdown: any = "l";
}
class DataPointCardSettings extends FormattingSettingsCard {

    showAllDataPoints = new formattingSettings.ToggleSwitch({
        name: "showAllDataPoints",
        displayName: "Show Dropdown",
        value: true
    })


    name: string = "dataPoint";
    displayName: string = "Dropdown";
    slices: Array<FormattingSettingsSlice> = [this.showAllDataPoints];
}

class DataPointCardSettings2 extends FormattingSettingsCard {

    licenceValue = new formattingSettings.TextInput({
        name: "licenceValue",
        displayName: "Add License Key",
        placeholder: "Enter License Key",
        value: ""
    });


    name: string = "licenceKey";
    displayName: string = "Licence Key";
    slices: Array<FormattingSettingsSlice> = [this.licenceValue];
}

class DataPointCardSettings3 extends FormattingSettingsCard {

    circleRepresentValue = new formattingSettings.TextInput({
        name: "circleRepresentValue",
        displayName: "Circle Represent Value",
        placeholder: "5000",
        value: ""
    });
    lableXValue = new formattingSettings.TextInput({
        name: "lableXValue",
        displayName: "Add X Lable",
        placeholder: "",
        value: ""
    });

    lableYValue = new formattingSettings.TextInput({
        name: "lableYValue",
        displayName: "Add Y Lable",
        placeholder: "",
        value: ""
    });

    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Color of Average Line",
        value: { value: "" }
    });

    leftColor = new formattingSettings.ColorPicker({
        name: "leftColor",
        displayName: "Color of Left Bubbles",
        value: { value: "" }
    });

    rightColor = new formattingSettings.ColorPicker({
        name: "rightColor",
        displayName: "Color of Right Bubbles",
        value: { value: "" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "circle radius",
        value: 5
    });


    name: string = "customLabel";
    displayName: string = "Customize Label";
    slices: Array<FormattingSettingsSlice> = [this.circleRepresentValue, this.lableXValue, this.lableYValue, this.defaultColor, this.leftColor, this.rightColor, this.fontSize];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {

    dataPointCard = new DataPointCardSettings();
    lice = new DataPointCardSettings2();
    axisLabel = new DataPointCardSettings3();

    cards = [this.dataPointCard, this.lice, this.axisLabel];
}

export class VisualSettings extends DataViewObjectsParser {

    public dropdown: Dropdown = new Dropdown();

}




