import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import LocalStorageProvider from '../../Services/LocalStorageProvider';
import SimConnectDataProvider, { simConnectGetPlanePanelProfilesInfo }  from '../../Services/DataProviders/SimConnectDataProvider';
import { useWindowDimensions } from '../../Components/Util/hooks';
import ApplicationBar from './ApplicationBar';
import TelemetryPanel from './TelemetryPanel';
import MapPanel from '../../Components/Panel/Default/MapPanel';
import PopoutPanelContainer from './PopoutPanelContainer';

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
    mapPanel: {
        width: '100vw',
        height: '100%'
    },
    popoutPanel: {
        width: '100%',
        height: '100%'
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
    framePanelContainer: {
        position: 'relative',
        backgroundColor: 'transparent',
        margin: '0 auto',
        height: `calc(${props.windowHeight - 1}px)`,
        //aspectRatio: 1
    }
}));

const WebPanel = ({planeId, panelId, displayFormat}) => {
    const classes = useStyles(useWindowDimensions())();
    const [mapOpen, setMapOpen] = useState(false);
    const [ planeProfile, setPlaneProfile] = useState();
    const [ panelProfile, setPanelProfile] = useState();
    const [ planePanelProfileInfo, setPlanePanelProfileInfo ] = useState();

    useEffect(() => {
        if (displayFormat.toLowerCase() === 'framepanel')
            document.body.style.backgroundColor = 'transparent';
        else
            document.body.style.backgroundColor = 'black';

        simConnectGetPlanePanelProfilesInfo().then(data => 
        {
            if(data !== null)
            {
                setPlanePanelProfileInfo(data);
                
                // setup plane and panel profile
                let planeProfile = data.planes.find(x => x.planeId.toLowerCase() === planeId);
                if(planeProfile !== undefined)
                {
                    setPlaneProfile(planeProfile);
                    setPanelProfile(planeProfile.panels.find(x => x.panelId.toLowerCase() === panelId))   
                }
            }
        })

        
    }, [planeId, panelId, displayFormat]);

    return (
        <LocalStorageProvider initialData={{}}>
            <SimConnectDataProvider>
                <CssBaseline />


                { planePanelProfileInfo !== undefined && panelProfile !== undefined && displayFormat !== undefined && 
                    <Container className={classes.rootFullWidth}>
                        <div className={classes.appbar}>
                            <ApplicationBar showMapIcon={panelProfile.hasMap} mapOpenChanged={() => setMapOpen(!mapOpen)} planeInfo={{planeName: planeProfile.name, panelName: panelProfile.name}}></ApplicationBar>
                            { panelProfile.hasTelemetryDisplay && <TelemetryPanel></TelemetryPanel> }
                        </div>
                    
                        <div className={classes.panelContainer} style={{ aspectRatio: String(planePanelProfileInfo.panels.filter(x => x.panelId === panelProfile.panelId && x.planeId.toLowerCase() == planeId).panelRatio) }}>
                            { panelProfile.hasMap &&
                                <div className={classes.mapPanel} style={{display: mapOpen ? '' : 'none'}}>
                                    <MapPanel mapType={'full'} refresh={mapOpen}/>
                                </div>
                            }
                            <div className={classes.popoutPanel} style={{display: mapOpen ? 'none' : ''}}>
                                <PopoutPanelContainer panelInfo={planePanelProfileInfo.panels.filter(x => x.panelId === panelProfile.panelId && x.planeId.toLowerCase() == planeId)} displayFormat={displayFormat}/> 
                            </div>
                        </div>
                    </Container>
                }
                {
                    panelProfile === undefined &&
                    <div style={{paddingLeft: '10px'}}>
                        <p>Unable to load panel with invalid parameters or missing profile data ....................</p>
                        <p>Plane type:  {planeId}</p>
                        <p>Panel type:  {panelId}</p>
                        <p>Display format: {displayFormat}</p>
                        <p>Plane Panel Profile data: {String(planePanelProfileInfo)}</p>
                    </div>
                }
                
            </SimConnectDataProvider>
        </LocalStorageProvider>
    )
}

export default WebPanel