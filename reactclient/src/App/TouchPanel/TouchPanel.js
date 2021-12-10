import React, { useMemo, useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import LocalStorageProvider from '../../Services/LocalStorageProvider';
import SimConnectDataProvider from '../../Services/DataProviders/SimConnectDataProvider';
import ApplicationBar from './ApplicationBar';
import PanelContainer from '../../Components/Panel/PanelContainer';

const useStyles = makeStyles((theme) => ({
    rootUseMediaQueryWidth: {
        [theme.breakpoints.up('sm')]: { fontSize: '12px' },
        [theme.breakpoints.up('md')]: { fontSize: '16px' },
        [theme.breakpoints.up('lg')]: { fontSize: '18px' },
        [theme.breakpoints.up('xl')]: { fontSize: '18px' },
        padding: 0,
        backgroundColor: theme.palette.background.default,
        height: '100vh',
        margin: '0 auto',
    },
    appbar: {
        touchAction: 'none',
        position: 'fixed',
        width: '100vw',
        maxWidth: 'inherit',
        zIndex: 100,
    },
    panelContainer: {
        paddingTop: '35px',
    },
}));

const TouchPanel = () => {
    const classes = useStyles();
    const [mapOpen, setMapOpen] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(17, 19, 24, 1)';
    }, []);

    return useMemo(() => (
        <LocalStorageProvider initialData={{}}>
            <SimConnectDataProvider>
                <CssBaseline />
                <Container className={classes.rootUseMediaQueryWidth}>
                    <div className={classes.appbar}>
                        <ApplicationBar
                            mapOpenChanged={() => setMapOpen(!mapOpen)}>
                        </ApplicationBar>
                    </div>
                    <div className={classes.panelContainer}>
                        <PanelContainer mapOpen={mapOpen}></PanelContainer>
                    </div>
                </Container>
            </SimConnectDataProvider>
        </LocalStorageProvider>
    ), [classes, mapOpen]);
}

export default TouchPanel
