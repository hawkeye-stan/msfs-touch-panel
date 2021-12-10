import React, { useEffect, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import { planeType } from '../../planeType';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import UsbIcon from '@mui/icons-material/Usb';
import MapIcon from '@mui/icons-material/Map';
import WebIcon from '@mui/icons-material/Web';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingConfiguration from '../../Components/ControlGroup/SettingConfiguration';
import SettingPlaneProfile from '../../Components/ControlGroup/SettingPlaneProfile';

const useStyles = makeStyles(() => ({
    toolbar: {
        minHeight: '1.5em',
        padding: 0
    },
    menuIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    statusIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    planeTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    menuButton: {
        marginRight: '0.5em',
        marginLeft: '0.5em'
    },
    networkConnected: {
        color: 'lightgreen'
    },
    networkDisconnected: {
        color: 'red'
    },
    drawer: {
        width: 250,
    },
}));

const ApplicationBar = ({ mapOpenChanged }) => {
    const classes = useStyles();
    const history = useHistory();
    const { networkStatus, arduinoStatus, simConnectSystemEvent } = useSimConnectData();
    const { updatePlaneProfile } = useLocalStorageData();
    const { PLANE_TITLE } = useSimConnectData().simConnectData;

    // Automatically change plane profile selection
    useEffect(() => {
        if (simConnectSystemEvent === 'SIMSTART' && PLANE_TITLE !== undefined) {
            let matched = Object.entries(planeType).filter(([key, value]) => value.matchTitleString.filter(m => PLANE_TITLE.indexOf(m) > -1).length > 0);

            if (matched.length > 0)
                updatePlaneProfile(matched[0][1].key);
            else
                updatePlaneProfile(planeType.DEFAULT.key);
        }

    }, [PLANE_TITLE, simConnectSystemEvent])

    return useMemo(() => (
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar className={classes.toolbar}>
                    <Grid container>
                        <Grid item xs={3} className={classes.statusIcons}>
                            <IconButton color='inherit' aria-label='network status' size='small' className={classes.menuButton}>
                                <NetworkCheckIcon className={networkStatus ? classes.networkConnected : classes.networkDisconnected} />
                            </IconButton>
                            <IconButton color='inherit' aria-label='arduino status' size='small' className={classes.menuButton}>
                                <UsbIcon className={arduinoStatus ? classes.networkConnected : classes.networkDisconnected} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" className={classes.planeTitle}>MSFS Touch Panel{PLANE_TITLE === '' ? '' : ' - ' + PLANE_TITLE}</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.menuIcons}>
                            <IconButton color='inherit' aria-label='map' size='small' className={classes.menuButton} onClick={() => history.push('/webpanel')}>
                                <WebIcon />
                            </IconButton>
                            <IconButton color='inherit' aria-label='map' size='small' className={classes.menuButton} onClick={() => mapOpenChanged()}>
                                <MapIcon />
                            </IconButton>
                            <IconButton color='inherit' aria-label='profile' size='small' className={classes.menuButton} >
                                <SettingPlaneProfile></SettingPlaneProfile>
                            </IconButton>
                            <IconButton color='inherit' aria-label='settings' size='small' className={classes.menuButton}>
                                <SettingConfiguration></SettingConfiguration>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div >
    ), [classes, PLANE_TITLE, networkStatus, arduinoStatus, mapOpenChanged]);
}

export default ApplicationBar;