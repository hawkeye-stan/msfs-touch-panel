import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from "./ServicesConst";
import { initializeDataContainer, parseRequestData } from './simConnectDataParser';
import jref from 'json-ref-lite'

const SIMCONNECT_DATA_REQUEST_INTERVAL_SLOW = 5000;
const SimConnectDataContext = createContext(null);

const SimConnectDataProvider = ({ children }) => {
    const [simConnectData, setSimConnectData] = useState(initializeDataContainer());
    const [networkStatus, setNetworkStatus] = useState(null);
    const [arduinoStatus, setArduinoStatus] = useState(null);
    const [simConnectSystemEvent, setSimConnectSystemEvent] = useState(null);
    const [g1000NxiFlightPlan, setG1000NxiFlightPlan] = useState(null);

    // request data from SimConnect on timer interval
    useEffect(() => {
        let requestInterval = null;

        let localSettings = localStorage.getItem('settings');

        if(localSettings !== null)
            requestInterval = JSON.parse(localStorage.getItem('settings')).dataRefreshInterval;
        else
            requestInterval = 500;
            
        const requestData = async () => {
            try{
                let response = await fetch(`${API_URL.url}/getdata`);
                let result = await response.json();
                
                if(result === undefined)
                    throw new Error('MSFS Touch Panel Server error');

                if(result.msfsStatus !== null)
                    setNetworkStatus(Boolean(result.msfsStatus));
                else
                    setNetworkStatus(false);

                if(result.arduinoStatus !== null)  
                    setArduinoStatus(Boolean(result.arduinoStatus));
                else
                    setArduinoStatus(false);

                if(result.systemEvent !== null)
                    setSimConnectSystemEvent(result.systemEvent.split('-')[0]);
                else
                    setSimConnectSystemEvent(null);

                if (!result.msfsStatus)
                    handleConnectionError('MSFS SimConnect is not available.')

                if (result.data !== null) {
                    var simData = JSON.parse(result.data);
                    setG1000NxiFlightPlan(result.g1000NxiFlightPlan !== '' ? JSON.parse(result.g1000NxiFlightPlan) : null);

                    if ((simData !== null && simData !== [])) {
                        setSimConnectData(parseRequestData(simData));
                        clearInterval(requestInterval);
                        let updateInterval = JSON.parse(localStorage.getItem('settings')).dataRefreshInterval;
                        requestInterval = setInterval(() => requestData(), updateInterval);
                    }
                }
            }
            catch (error) {
                console.log(error);
                setNetworkStatus(false);
                handleConnectionError('MSFS Touch Panel Server is not available.')
            }
        }

        const handleConnectionError = (errorMessage) => {
            console.error(errorMessage);
            clearInterval(requestInterval);
            requestInterval = setInterval(() => requestData(), SIMCONNECT_DATA_REQUEST_INTERVAL_SLOW);      // slow down the request data interval until network reconnection
        }

        requestData();

        return () => {
            clearInterval(requestInterval);
        }
    }, [])

    return (
        <SimConnectDataContext.Provider value={{ simConnectData, networkStatus, arduinoStatus, simConnectSystemEvent, g1000NxiFlightPlan }}>
            {children}
        </SimConnectDataContext.Provider>
    )
}

export default SimConnectDataProvider;

// custom hook
export const useSimConnectData = () => useContext(SimConnectDataContext);

export const simConnectGetFlightPlan = async () => {
    try {
        let response = await fetch(`${API_URL.url}/getflightplan`);
        let result = await response.json();

        return result;
    }
    catch {
        console.error('MSFS unable to load flight plan.')
    }
}

export const simConnectGetPlanePanelProfilesInfo = async () => {
    try {
        let response = await fetch(`${API_URL.url}/getplanepanelprofileinfo`);
        let data = await response.json();

        for(const plane of data)
        {
            let result = await getLocalPopoutPanelDefinitions(plane.planeId);
            plane.panels.forEach(x => { 
                x.definitions = result.PANEL_CONTROL_DEFINITION[x.definitions];
            })
        }

        return data;
    }
    catch {
        console.error('Unable to retrieve plane panel profiles. There may be an error with PlanePanelProfileInfo.json.');
        return null;
    }
}

export const getPopoutPanelDefinitions = async () => {
    try {
        let response = await fetch(`${API_URL.url}/getPopoutPanelDefinitions`);
        let data = await response.json();
        return jref.resolve(data);
    }
    catch {
        console.error('Unable to retrieve pop out panel definitions from server. There may be an error with PopoutPanelDefinition.json.')
    }
}

export const getLocalPopoutPanelDefinitions = async (planeId) => {
    try {
        let response = await fetch(`/profiles/${planeId}/PopoutPanelDefinition.json`, { headers : { 'Content-Type': 'application/json', 'Accept': 'application/json'} } )
        let data = await response.json();

        // resolve ref pointers within JSON
        return jref.resolve(data);
    }
    catch {
        console.error('Unable to retrieve pop out panel definitions. There may be an error with PopoutPanelDefinition.json.')
        return null;
    }
}