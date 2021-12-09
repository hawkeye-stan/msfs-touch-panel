import { API_URL } from "../ServicesConst";

export const simConnectPost = (actionType, action, value, executionCount = 1) => {
    let planeProfile = localStorage.getItem('planeProfile');

    if(action === undefined || value === undefined)
        return;

    let data = {action: action, actionType: actionType, value: value, executionCount: executionCount, planeProfile: planeProfile };
    console.log(data);

    fetch(`${API_URL.url}/postdata`, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(data)
    })
}

