import { API_URL } from "../ServicesConst";
import {simconnectDataType }from '../DataProviders/simConnectDataType';

export const simConnectPost = (action, value, actionType) => {
    let planeProfile = localStorage.getItem('planeProfile');

    if(action === undefined || value === undefined)
        return;

    if(actionType === undefined)
        actionType = 'SimConnect';

    let data = {action: action, value: value, actionType: actionType, planeProfile: planeProfile };

    fetch(`${API_URL.url}/postdata`, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(data)
    })
}

export const simConnectSetLVar = (propName, value) => {
    if(propName === undefined || value === undefined)
        return;

    let data = {propName: simconnectDataType[propName], value: String(value)};
    

    fetch(`${API_URL.url}/setlvar`, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(data)
    })
}

