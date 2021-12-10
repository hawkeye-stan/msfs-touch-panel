
import React from 'react';
import LocalStorageProvider from '../..//Services/LocalStorageProvider';
import SimConnectDataProvider from '../../Services/DataProviders/SimConnectDataProvider';
import CssBaseline from '@mui/material/CssBaseline';
import makeStyles from '@mui/styles/makeStyles';
import MapPanel from '../../Components/Panel/Default/MapPanel';

const useStyles = makeStyles({
    mapPanel: {
        height: '100vh',
    },
});

const WebMapPanel = ({mapType}) => {
    const classes = useStyles();

    return (
        <LocalStorageProvider initialData={{}}>
            <SimConnectDataProvider>
                <CssBaseline />
                    <div className={classes.mapPanel} >
                        <MapPanel mapType={mapType}></MapPanel>
                    </div>
            </SimConnectDataProvider>
        </LocalStorageProvider>
    );
}

export default WebMapPanel