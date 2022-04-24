// import { simconnectDataType } from './simConnectDataType';
// import { simConnectDataTypeDefault } from './simConnectDataTypeDefault';
import { API_URL } from "./ServicesConst";

export const initializeDataContainer = async () => {
    let response = await fetch(`${API_URL.url}/getdata`);
    return response.json
}

export const parseRequestData = (resultData) => {
    if(resultData === []) return [];

    let newData = [];

    // Format value as specified by the data key as needed and apply defaults
    resultData.forEach(item => {
        if(item.javaScriptFormatting !== null)
        {
            item.value = formattingMethod[item.javaScriptFormatting](item.value);
        }

        if(item.value === null || item.value === undefined)
        {
            item.value = item.defaultValue;
        }

        newData[item.propName] = item.value;
    })

    return newData;
}

export const formattingMethod = {
    toFixed0: function(value)
    {
        return value.toFixed(0);
    },
    toFixed1: function(value)
    {
        return value.toFixed(1);
    },
    toFixed2: function(value)
    {
        return value.toFixed(2);
    },
    toFixed3: function(value)
    {
        return value.toFixed(3);
    },
    toFixed4: function(value)
    {
        return value.toFixed(4);
    },
    padStartZero4: function(value)
    {
        return String(value).padStart(4, '0');
    },
    decToHex: function(value){
        let str = value.toString(16);
        return str.substring(0, str.length - 4).padStart(4, '0');
    }
}