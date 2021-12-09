import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider'
import { MapContainer } from 'react-leaflet';
import MapDisplay from '../../ControlGroup/Default/MapDisplay';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
        border: '1px solid ' + theme.palette.divider,
        borderRadius: theme.spacing(1),
        touchAction: 'none'
    },
}));

const MapPanel = () => {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <MapContainer zoom={15} scrollWheelZoom={true} style={{ height: '100%'}}>
                <MapDisplay/>
            </MapContainer>
        </div>
    )
}

export default MapPanel;

