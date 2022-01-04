import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import SettingsIcon from '@mui/icons-material/Settings';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NumericEntryDisplay from '../Control/NumericEntryDisplay';
import { config as planeConfig } from '../Panel/PanelConfig'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    panel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '300px'
    },
    grid: {
        padding: '8px'
    },
    gridTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0em',
        marginTop: '8px',
        borderTop: '1px solid ' + theme.palette.border,
        borderBottom: '1px solid ' + theme.palette.border
    },
    gridItemKey: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-Start',
        alignItems: 'center',
        padding: '0 0 0 8px'
    },
    gridItemValueLabel: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 8px 0 0'
    }
}));

const SettingConfiguration = () => {
    const classes = useStyles();
    const { configurationData, updateConfigurationData, planeProfile } = useLocalStorageData();
    const [configSettingsIsOpen, setConfigSettingsIsOpen] = useState(false);

    const handleChange = (key, value = null) => {
        let updatedData = { ...configurationData };

        switch (key) {
            case 'dataRefreshInterval':
            case 'mapRefreshInterval':
                updatedData[key] = value;
                break;
            case 'isUsedArduino':
            case 'showLog':
                updatedData[key] = !configurationData[key];
                break;
            default:
                updatedData.panelVisibility[planeProfile][key] = !configurationData.panelVisibility[planeProfile][key]
                break;
        }

        updateConfigurationData(updatedData);
    }

    const BooleanItem = (props) => (
        <Grid container>
            <Grid item xs={6} className={classes.gridItemKey}>
                <Typography variant='body1'>{props.itemLabel}</Typography>
            </Grid>
            <Grid container item xs={6} alignItems="center">
                <Grid item xs={4} className={classes.gridItemValueLabel}>
                    <Typography variant='body1'>{props.offLabel}</Typography>
                </Grid>
                <Grid item xs={4} className={classes.gridItemValueLabel}>
                    <Switch
                        checked={props.onFunc}
                        onChange={() => handleChange(props.itemKey)}
                        color='primary'
                        name={props.itemKey}
                        size='medium'
                        inputProps={{ 'aria-label': props.itemKey }} />
                </Grid>
                <Grid item xs={4} className={classes.gridItemValueLabel}>
                    <Typography variant='body1'>{props.onLabel}</Typography>
                </Grid>
            </Grid>
        </Grid>
    )

    const NumericItem = (props) => (
        <Grid container>
            <Grid item xs={6} className={classes.gridItemKey}>
                <Typography variant='body1'>{props.itemLabel}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.gridItemValueLabel}>
                <div style={{ margin: '0', padding: '4px' }}>
                    <NumericEntryDisplay
                        initialValue={configurationData[props.itemKey]}
                        numberOfDigit={4}
                        numberOfDisplayDigit={4}
                        decimalPlaces={0}
                        minValue={props.minInterval}
                        maxValue={props.maxInterval}
                        usedByArduino={false}
                        allowInputOption={false}
                        onSet={(value) => handleChange(props.itemKey, (Number(value)))}
                    />
                </div>
                <Typography variant='body1'>ms</Typography>
            </Grid>
        </Grid>
    )

    return (
        <div className={classes.root}>
            <SettingsIcon onClick={() => setConfigSettingsIsOpen(true)} />
            <SwipeableDrawer
                anchor='right'
                open={configSettingsIsOpen}
                onClose={() => setConfigSettingsIsOpen(false)}
                onOpen={() => setConfigSettingsIsOpen(true)}>
                <div className={classes.panel}>
                    <Grid container className={classes.grid}>
                        <Grid item xs={12} className={classes.gridTitle}>
                            <Typography variant='h5'>Settings</Typography>
                        </Grid>
                        <NumericItem itemKey='dataRefreshInterval' itemLabel='Data Refresh Interval' minInterval={50} maxInterval={5000}></NumericItem>
                        <NumericItem itemKey='mapRefreshInterval' itemLabel='Map Refresh Interval' minInterval={50} maxInterval={5000}></NumericItem>
                        <BooleanItem itemKey='isUsedArduino' itemLabel='Use Arduino' onLabel='Yes' offLabel='No' onFunc={configurationData.isUsedArduino}></BooleanItem>
                        <Grid item xs={12} className={classes.gridTitle}>
                            <Typography variant='h5'>Panels</Typography>
                        </Grid>
                        {planeProfile !== undefined &&
                            planeConfig[planeProfile].map(panel =>
                                <BooleanItem key={panel.key} itemKey={panel.key} itemLabel={panel.name} onLabel='Show' offLabel='Hide' onFunc={configurationData.panelVisibility[planeProfile][panel.key]}></BooleanItem>
                            )}
                        <BooleanItem itemKey={'showLog'} itemLabel={'Console Log'} onLabel='Show' offLabel='Hide' onFunc={configurationData.showLog}></BooleanItem>
                    </Grid>
                </div>
            </SwipeableDrawer>
        </div>
    )
}

export default SettingConfiguration;
