import { API_URL } from "./ServicesConst";

export const simConnectPost = (action, value, actionType) => {
    if(action === undefined || value === undefined)
        return;

    if(actionType === undefined)
        actionType = 'SimConnect';

    let data = {action: action, value: value, actionType: actionType};

    fetch(`${API_URL.url}/postdata`, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(data)
    })
}

export const simConnectSetLVar = (propName, value) => {
    if(propName === undefined || value === undefined)
        return;

    let data = {propName: propName, value: String(value)};
    
    fetch(`${API_URL.url}/setlvar`, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(data)
    })
}