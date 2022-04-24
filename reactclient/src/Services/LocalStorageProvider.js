import React, { createContext, useContext, useState, useEffect } from 'react';

const LocalStorageDataContext = createContext(null);

const LocalStorageProvider = ({ initialData, children }) => {
    const [configurationData, setConfigurationData] = useState(initialData);
    const [mapConfig, setMapConfig] = useState();

    useEffect(() => {
        // Set default map config
        setMapConfig({
            flightFollowing: true,
            showFlightPlan: true,
            showFlightPlanLabel: false,
            currentLayer: 'Open Street'
        });       
    }, [])

    const initializeLocalStorage = () => {
        // Default settings
        let settings = {
            dataRefreshInterval: 100,
            mapRefreshInterval: 250,
            isUsedArduino: false,
        };

        localStorage.setItem('settings', JSON.stringify(settings));
    }

    const updateConfigurationData = (value) => {
        localStorage.setItem('settings', JSON.stringify(value));
        setConfigurationData(value);
    }

    // get data from local storage
    useEffect(() => {
        if (localStorage.getItem('settings') === null)
            initializeLocalStorage();

        setConfigurationData(JSON.parse(localStorage.getItem('settings')));
    }, [])

    return (
        <LocalStorageDataContext.Provider value={{ configurationData, updateConfigurationData, mapConfig }}>
            {children}
        </LocalStorageDataContext.Provider>
    )
}

export default LocalStorageProvider;

// custom hook
export const useLocalStorageData = () => useContext(LocalStorageDataContext);