import React, { Suspense, useMemo, createElement, useState, useEffect } from 'react';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import MapPanel from './Default/MapPanel';
import ConsoleLogPanel from './Default/ConsoleLogPanel';
import * as PlaneConfig from './PanelConfig';

const useStyles = makeStyles(() => ({
    layout: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '90vh'
    },
    panel: {
        marginTop: '0.5em',
        '&:last-child':
        {
            paddingBottom: '15px'
        },
    },
    mapLayout: {
        touchAction: 'none',
    },
    mappanel: {
        height: '85vh',
    },
    loading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    }
}));

// Loads panel dynamically based on plane profile
const PanelContainer = ({ mapOpen }) => {
    const classes = useStyles();
    const { configurationData, planeProfile } = useLocalStorageData();
    const { panelVisibility } = configurationData;

    return useMemo(() => (
        <div className={classes.root}>
            <div className={classes.layout} style={{display: mapOpen ? 'none' : 'block'}}>
                <Suspense fallback={<div className={classes.loading}><Typography variant='h6'>Loading Panels...</Typography></div>}>
                    {planeProfile != null &&
                        PlaneConfig.config[planeProfile].map(panel =>
                            (!mapOpen) && panelVisibility[planeProfile][panel.key] &&
                            <div key={panel.key} className={classes.panel}>{createElement(PlaneConfig[panel.id])}</div>
                        )}
                </Suspense>
                {configurationData.showLog &&
                    <div className={classes.panel}>
                        <ConsoleLogPanel />
                    </div>
                }
            </div>
            <div className={classes.mapLayout} style={{display: mapOpen ? 'block' : 'none'}}>
                <div className={classes.mappanel}>
                    <MapPanel mapType={'full'} refresh={mapOpen} />
                </div>
            </div>
        </div>

    ), [classes, mapOpen, planeProfile, panelVisibility, configurationData])
}

export default PanelContainer
