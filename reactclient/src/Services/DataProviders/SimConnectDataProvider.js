import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDataContainer, parseRequestData } from './simConnectDataParser';

const SIMCONNECT_DATA_REQUEST_INTERVAL_SLOW = 5000;
const SimConnectDataContext = createContext(null);

const SimConnectDataProvider = ({ children }) => {
    const [simConnectData, setSimConnectData] = useState(initializeDataContainer([]));
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
            
        const requestData = () => {
            fetch('/getdata')
                .then(async response => {
                    return await response.json();
                })
                .then(result => {
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

                    if (result.msfsStatus)
                        console.info('MSFS SimConnect is connected.')
                    else
                        handleConnectionError('MSFS SimConnect is not available.')

                    if (result.data !== null || result.lvar !== null) {
                        var simData = JSON.parse(result.data);
                        var simLVarData = JSON.parse(result.lVar);
                        setG1000NxiFlightPlan(result.g1000NxiFlightPlan !== '' ? JSON.parse(result.g1000NxiFlightPlan) : null);

                        if ((simData !== null && simData !== []) || (simLVarData !== null && simLVarData !== [])) {
                            setSimConnectData(parseRequestData(simData, simLVarData));
                            clearInterval(requestInterval);
                            let updateInterval = JSON.parse(localStorage.getItem('settings')).dataRefreshInterval;
                            requestInterval = setInterval(() => requestData(), updateInterval);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    setNetworkStatus(false);
                    handleConnectionError('MSFS Touch Panel Server is not available.')
                });
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
    return await fetch('getflightplan')
        .then(response => response.json())
        .catch(error => {
            console.error('MSFS unable to load flight plan.')
        });
}

