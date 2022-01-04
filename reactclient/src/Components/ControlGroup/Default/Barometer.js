import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { simActions } from '../../../Services/ActionProviders/simConnectActionHandler';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';

const useStyles = makeStyles((theme) => ({
    section: theme.custom.panelSection,
    baromenterEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
}));

const Barometer = () => {
    const classes = useStyles();
    const { KOHLSMAN_SETTING_HG } = useSimConnectData().simConnectData;

    return useMemo(() => (
        <div className={classes.section}>
            <Grid container>
                <Grid item xs={3} className={classes.gridItem}>
                    <Typography variant='body1'>BARO</Typography>
                </Grid>
                <Grid item xs={9} className={classes.gridItem}>
                    <div className={classes.baromenterEntry}>
                        <NumericEntryDisplay
                            id={'barometer'}
                            initialValue={KOHLSMAN_SETTING_HG}
                            numberOfDigit={4}
                            numberOfDisplayDigit={5}
                            decimalPlaces={2}
                            minValue={28}
                            maxValue={32}
                            allowInputOption={true}
                            onSelect={simActions.Barometer.select}
                            onSet={(value) => simActions.Barometer.set(value)} />
                        <div style={{ paddingLeft: '0.25em' }}>
                            <Typography variant='body1'>Hg</Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    ), [classes, KOHLSMAN_SETTING_HG])
}

export default Barometer;