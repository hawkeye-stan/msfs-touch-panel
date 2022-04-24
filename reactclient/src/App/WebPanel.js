import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import LocalStorageProvider from '../Services/LocalStorageProvider';
import SimConnectDataProvider, { simConnectGetPlanePanelProfilesInfo }  from '../Services/DataProviders/SimConnectDataProvider';
import { useWindowDimensions } from '../Components/Util/hooks';
import ApplicationBar from './ApplicationBar';
import MapPanel from './MapPanel';
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
    panelContainer: {
        position: 'relative',
        backgroundColor: 'transparent',
        margin: '2em auto 0 auto',
        height: `calc(${props.windowHeight - 1}px - 2em)`,
        //aspectRatio: 1
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

    useEffect(() => {
        if (displayFormat.toLowerCase() === 'framepanel')
            document.body.style.backgroundColor = 'transparent';
        else
            document.body.style.backgroundColor = 'black';

        simConnectGetPlanePanelProfilesInfo().then(data => 
        {
            if(data !== null)
            {
                // setup plane and panel profile
                let planeProfile = data.find(x => x.planeId.toLowerCase() === planeId);
                planeProfile.panels.forEach(x => x.planeId = planeId);      // adds plane id into panel object

                var panelProfile = planeProfile.panels.find(x => x.panelId.toLowerCase() === panelId);
                
                if(panelProfile !== undefined)
                {
                    setPlaneProfile(planeProfile);
                    setPanelProfile(panelProfile)   
                }
            }
        })

        
    }, [planeId, panelId, displayFormat]);

    return (
        <LocalStorageProvider initialData={{}}>
            <SimConnectDataProvider>
                <CssBaseline />

                { panelProfile !== undefined && displayFormat !== undefined && 
                    <Container className={classes.rootFullWidth}>
                        <div className={classes.appbar}>
                            <ApplicationBar showMapIcon={true} mapOpenChanged={() => setMapOpen(!mapOpen)} planeInfo={{planeName: planeProfile.name, panelName: panelProfile.name}}></ApplicationBar>
                        </div>
                    
                        <div className={classes.panelContainer} style={{ aspectRatio: String(panelProfile.panelRatio) }}>
                            <div className={classes.mapPanel} style={{display: mapOpen ? '' : 'none'}}>
                                <MapPanel mapType={'full'} refresh={mapOpen}/>
                            </div>
                            <div className={classes.popoutPanel} style={{display: mapOpen ? 'none' : ''}}>
                                <PopoutPanelContainer panelInfo={panelProfile} displayFormat={displayFormat}/> 
                            </div>
                        </div>
                    </Container>
                }
                {
                    panelProfile === undefined &&
                    <div style={{paddingLeft: '10px'}}>
                        <p>Unable to load panel because of invalid parameters or missing profile data ....................</p>
                        <p>Plane type:  {planeId}</p>
                        <p>Panel type:  {panelId}</p>
                        <p>Display format: {displayFormat}</p>
                    </div>
                }
                
            </SimConnectDataProvider>
        </LocalStorageProvider>
    )
}

export default WebPanel