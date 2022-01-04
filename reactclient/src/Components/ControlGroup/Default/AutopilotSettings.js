import React, { useMemo, useEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import { simActions } from '../../../Services/ActionProviders/simConnectActionHandler';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';

const useStyles = makeStyles((theme) => ({
    section: {
        ...theme.custom.panelSection,
        width: '100%'
    },
    autopilot: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const AutoPilotSettings = () => {
    const classes = useStyles();
    const onColor = 'rgb(32, 217, 32, 1)';

    const { directInputAutopilot } = useLocalStorageData().configurationData;
    const { AUTOPILOT_ALTITUDE, AUTOPILOT_HEADING, AUTOPILOT_VS, AUTOPILOT_FLC, AP_ALTITUDE_HOLD_ON,
        AP_HEADING_HOLD_ON, AP_VS_HOLD_ON, AP_FLC_HOLD_ON, PLANE_ALTITUDE, PLANE_HEADING } = useSimConnectData().simConnectData;

    const planeAltitude = useRef();
    const planeHeading = useRef();

    useEffect(() => {
        if (planeAltitude !== PLANE_ALTITUDE)
            planeAltitude.current = PLANE_ALTITUDE;

        if (planeHeading !== PLANE_HEADING)
            planeHeading.current = PLANE_HEADING;

    }, [PLANE_ALTITUDE, PLANE_HEADING])

    return useMemo(() => (
        <Grid container className={classes.autopilot}>
            <Grid item xs={7} className={classes.gridItem}>
                <div className={classes.section}>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'ALT'} color='primary' style={{ backgroundColor: AP_ALTITUDE_HOLD_ON ? onColor : '' }} onClick={simActions.Autopilot.Altitude.hold}>ALT</Button>
                    </div>
                    <div className={'ALT-DIGIT'}>
                        <NumericEntryDisplay
                            id={'altitudeEntry'}
                            initialValue={AUTOPILOT_ALTITUDE}
                            numberOfDigit={5}
                            numberOfDisplayDigit={5}
                            showDualKnob={true}
                            minValue={-2000}
                            maxValue={99900}
                            directInput={directInputAutopilot}
                            onSet={simActions.Autopilot.Altitude.set}
                            onSelect={simActions.Autopilot.Altitude.select} />
                    </div>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'ALT-SYNC'} color='primary' onClick={() => simActions.Autopilot.Altitude.sync(planeAltitude.current)}>SYNC</Button>
                    </div>
                </div>
            </Grid>
            <Grid item xs={5} className={classes.gridItem}>
                <div className={classes.section}>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'VS'} color='primary' style={{ backgroundColor: AP_VS_HOLD_ON ? onColor : '' }} onClick={simActions.Autopilot.VS.hold}>VS</Button>
                    </div>
                    <div className={'VS-DIGIT'}>
                        <NumericEntryDisplay
                            id={'vsEntry'}
                            initialValue={AUTOPILOT_VS}
                            numberOfDigit={4}
                            numberOfDisplayDigit={5}
                            minValue={-9900}
                            maxValue={9900}
                            directInput={directInputAutopilot}
                            onSet={simActions.Autopilot.VS.set}
                            onSelect={simActions.Autopilot.VS.select} />
                    </div>
                </div>
            </Grid>
            <Grid item xs={7} className={classes.gridItem}>
                <div className={classes.section}>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'HDG'} color='primary' style={{ backgroundColor: AP_HEADING_HOLD_ON ? onColor : '' }} onClick={simActions.Autopilot.Heading.hold}>HDG</Button>
                    </div>
                    <div className={'HDG-DIGIT'}>
                        <NumericEntryDisplay
                            id={'headingEntry'}
                            initialValue={AUTOPILOT_HEADING}
                            numberOfDigit={3}
                            numberOfDisplayDigit={5}
                            disableNumPadKeys={['-']}
                            showDualKnob={true}
                            minValue={0}
                            maxValue={359}
                            directInput={directInputAutopilot}
                            onSet={simActions.Autopilot.Heading.set}
                            onSelect={simActions.Autopilot.Heading.select} />
                    </div>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'HDG-SYNC'} color='primary' onClick={() => simActions.Autopilot.Heading.sync(planeHeading.current)}>SYNC</Button>
                    </div>
                </div>
            </Grid>
            <Grid item xs={5} className={classes.gridItem}>
                <div className={classes.section}>
                    <div className={classes.buttonBox}>
                        <Button variant="contained" size='small' className={'FLC'} color='primary' style={{ backgroundColor: AP_FLC_HOLD_ON ? onColor : '' }} onClick={simActions.Autopilot.FLC.hold}>FLC</Button>
                    </div>
                    <div className={'FLC-DIGIT'}>
                        <NumericEntryDisplay
                            id={'flcEntry'}
                            initialValue={AUTOPILOT_FLC}
                            numberOfDigit={3}
                            numberOfDisplayDigit={5}
                            disableNumPadKeys={['-']}
                            minValue={0}
                            maxValue={999}
                            directInput={directInputAutopilot}
                            onSet={simActions.Autopilot.FLC.set}
                            onSelect={simActions.Autopilot.FLC.select} />
                    </div>
                </div>
            </Grid>
        </Grid>
    ), [classes, directInputAutopilot, AUTOPILOT_ALTITUDE, AUTOPILOT_HEADING, AUTOPILOT_VS, AUTOPILOT_FLC,
        AP_ALTITUDE_HOLD_ON, AP_HEADING_HOLD_ON, AP_VS_HOLD_ON, AP_FLC_HOLD_ON])
}

export default AutoPilotSettings;