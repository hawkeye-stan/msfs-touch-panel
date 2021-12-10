import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FlightIcon from '@mui/icons-material/Flight';
import SensorWindowIcon from '@mui/icons-material/SensorWindow';
import { PLANE_PROFILE_INFO } from './PlaneProfileInfo';

const useStyles = makeStyles((theme) => ({
    rootFullWidth: {
        [theme.breakpoints.up('sm')]: { fontSize: '12px' },
        [theme.breakpoints.up('md')]: { fontSize: '16px' },
        [theme.breakpoints.up('lg')]: { fontSize: '18px' },
        [theme.breakpoints.up('xl')]: { fontSize: '18px' },
        padding: 0,
        maxWidth: '100vw',
        display: 'grid',
        overflow: 'hidden',
        height: '100%'
    }
}));

const PlaneProfileList = ({profile}) => {
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    
    const handlePanelSelect = (panel, panelType) => {
        history.push(`/${panelType}/${profile.id}/${panel}`);
    };

    return (
        <>
            <Divider></Divider>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><FlightIcon /></ListItemIcon> 
                <ListItemText primary={profile.name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {profile.panels.map((panel, idx) => 
                    <List key={idx} component="div" onClick={() => handlePanelSelect(panel.id, panel.type)}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon><SensorWindowIcon /></ListItemIcon>
                            <ListItemText primary={panel.name} />
                        </ListItemButton>
                    </List>
                )}
            </Collapse>
        </>
    )
}

const WebPanelSelection = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <List component="nav" subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Please select a plane profile to open the corresponding panel
                </ListSubheader>
            }>
            {PLANE_PROFILE_INFO.map((profile, idx) => 
                <PlaneProfileList key={idx} profile={profile}></PlaneProfileList>
            )}
        </List>
        </div>
    );
}

export default WebPanelSelection

