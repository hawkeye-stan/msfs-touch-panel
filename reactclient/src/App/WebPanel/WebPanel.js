import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import LocalStorageProvider from '../../Services/LocalStorageProvider';
import SimConnectDataProvider from '../../Services/DataProviders/SimConnectDataProvider';
import { useWindowDimensions } from '../../Components/Util/hooks';
import ApplicationBar from './ApplicationBar';
import TelemetryPanel from './TelemetryPanel';
import MapPanel from '../../Components/Panel/Default/MapPanel';
import PopoutPanelContainer from './PopoutPanelContainer';
import { PLANE_PROFILE_INFO } from './PlaneProfileInfo';

const useStyles = props => makeStyles((theme) => ({
    rootFullWidth: {
        [theme.breakpoints.up('sm')]: { fontSize: '12px' },
        [theme.breakpoints.up('md')]: { fontSize: '16px' },
        [theme.breakpoints.up('lg')]: { fontSize: '18px' },
        [theme.breakpoints.up('xl')]: { fontSize: '18px' },
        padding: 0,
        maxWidth: '100vw',
        overflow: 'hidden',
        height: '100%'
    },
    appbar: {
        touchAction: 'none',
        position: 'fixed',
        width: '100vw',
        maxWidth: 'inherit'
    },
    g1000NXiContainerBase: {
        position: 'relative',
        backgroundColor: 'transparent',
        touchAction: 'none',
        margin: '3.5em auto 0 auto',
    },
    g1000NXiContainer: {
        position: 'relative',
        backgroundColor: 'transparent',
        margin: '3.5em auto 0 auto',
        height: `calc(${props.windowHeight - 1}px - 3.6em)`,
        aspectRatio: 1
    },
    panelContainer: {
        position: 'relative',
        backgroundColor: 'transparent',
        margin: '2em auto 0 auto',
        height: `calc(${props.windowHeight - 1}px - 2em)`,
        aspectRatio: 1
    },
}));

const WebPanel = ({planeType, panelType, displayFormat}) => {
    const classes = useStyles(useWindowDimensions())();
    const [mapOpen, setMapOpen] = useState(false);
    const [ planeProfile, setPlaneProfile] = useState();
    const [ panelProfile, setPanelProfile] = useState();

    useEffect(() => {
        if (displayFormat.toLowerCase === 'framepanel')
            document.body.style.backgroundColor = 'transparent';
        else
            document.body.style.backgroundColor = 'black';

        // setup panel profile
        let planeProfile = PLANE_PROFILE_INFO.find(x => x.id.toLowerCase() === planeType);
        if(planeProfile !== undefined)
        {
            setPlaneProfile(planeProfile);
            setPanelProfile(planeProfile.panels.find(x => x.id.toLowerCase() === panelType))   
        }
    }, [planeType, panelType, displayFormat]);

    return (
        <LocalStorageProvider initialData={{}}>
            <SimConnectDataProvider>
                <CssBaseline />
                { panelProfile !== undefined && displayFormat !== undefined &&
                    <Container className={classes.rootFullWidth}>
                        <div className={classes.appbar}>
                            <ApplicationBar showMapIcon={panelProfile.hasMap} mapOpenChanged={() => setMapOpen(!mapOpen)} planeInfo={{planeName: planeProfile.name, panelName: panelProfile.name}}></ApplicationBar>
                            { panelProfile.hasTelemetryDisplay && <TelemetryPanel></TelemetryPanel> }
                        </div>
                        <div className={planeType.toLowerCase() === 'g1000nxi' ? classes.g1000NXiContainer : classes.panelContainer} style={{ aspectRatio: String(panelProfile.panelInfo.panelRatio) }}>
                            {mapOpen && panelProfile.hasMap && <MapPanel /> }
                            {<PopoutPanelContainer panelInfo={panelProfile.panelInfo} displayFormat={displayFormat}/> }
                        </div>
                    </Container>
                }
                {
                        panelProfile === undefined &&
                        <div style={{paddingLeft: '10px'}}>
                            <p>Unable to load panel with invalid parameters ....................</p>
                            <p>Plane type:  {planeType}</p>
                            <p>Panel type:  {panelType}</p>
                            <p>Display format: {displayFormat}</p>
                        </div>
                    }
                
            </SimConnectDataProvider>
        </LocalStorageProvider>
    )
}

export default WebPanel