import React, { createContext, useContext, useState, useEffect } from 'react';
import { planeType } from '../planeType';
import { config as planeConfig } from  '../Components/Panel/PanelConfig';

const LocalStorageDataContext = createContext(null);

const LocalStorageProvider = ({ initialData, children }) => {
    const [configurationData, setConfigurationData] = useState(initialData);
    const [planeProfile, setPlaneProfile] = useState();
    const [mapConfig, setMapConfig] = useState();

    useEffect(() => {
        // Set default map config
        setMapConfig({
            flightFollowing: true,
            showFlightPlan: true,
            showFlightPlanLabel: false,
            currentLayer: 'Google Terrain'
        });       
    }, [])

    const initializeLocalStorage = () => {
        // Default settings
        let settings = {
            dataRefreshInterval: 100,
            mapRefreshInterval: 250,
            isUsedArduino: false,
            numericInputType: 'knob',
            showLog: false,
            panelVisibility: { }
        };

        for (const prop in planeConfig) {
            settings.panelVisibility[`${prop}`] = {}
            planeConfig[prop].map(c => settings.panelVisibility[prop][c.key] = true);
        }

        localStorage.setItem('settings', JSON.stringify(settings));
        localStorage.setItem('planeProfile', planeType.DEFAULT.key);
    }

    const updateConfigurationData = (value) => {
        localStorage.setItem('settings', JSON.stringify(value));
        setConfigurationData(value);
    }

    const updatePlaneProfile = (value) => {
        localStorage.setItem('planeProfile', value);

        let configuration = JSON.parse(localStorage.getItem('settings'));

        // if plane profile does not exist in configuration
        if(configuration != null && configuration.panelVisibility[value] === undefined)
        {
            configuration.panelVisibility[`${value}`] = {}
            planeConfig[value].map(c => configuration.panelVisibility[value][c.key] = true);
            localStorage.setItem('settings', JSON.stringify(configuration));
            setConfigurationData(configuration);
        }

        setPlaneProfile(value);
    }

    const updateMapConfig = (value) => {
        setMapConfig(value);
    }

    // get data from local storage
    useEffect(() => {
        if (localStorage.getItem('settings') === null)
            initializeLocalStorage();

        setConfigurationData(JSON.parse(localStorage.getItem('settings')));
        setPlaneProfile(localStorage.getItem('planeProfile'));
    }, [])

    return (
        <LocalStorageDataContext.Provider value={{ configurationData, updateConfigurationData, planeProfile, updatePlaneProfile, mapConfig, updateMapConfig }}>
            {children}
        </LocalStorageDataContext.Provider>
    )
}

export default LocalStorageProvider;

// custom hook
export const useLocalStorageData = () => useContext(LocalStorageDataContext);

export const getSelectedPlanProfile = () => {
    return localStorage.getItem('planeProfile');
}
