import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';

const useStyles = makeStyles((theme) => ({
    section: theme.custom.panelSection,
    obsEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
}));

const Obs = ({ id, label, obsValueKey, entrySetAction, entrySelectAction }) => {
    const classes = useStyles();
    const { directInputOBS } = useLocalStorageData().configurationData;
    const { simConnectData } = useSimConnectData();

    const obsValue = Number(simConnectData[obsValueKey]);

    return useMemo(() => (
        <div className={classes.section}>
            <Grid container>
                <Grid item xs={4} className={classes.gridItem}>
                    <Typography variant='body1'>{label}</Typography>
                </Grid>
                <Grid item xs={8} className={classes.gridItem}>
                    <div className={classes.obsEntry}>
                        <NumericEntryDisplay
                            id={id}
                            initialValue={obsValue}
                            numberOfDigit={3}
                            numberOfDisplayDigit={3}
                            disableNumPadKeys={['-']}
                            minValue={0}
                            maxValue={359}
                            directInput={directInputOBS}
                            onSet={entrySetAction}
                            onSelect={entrySelectAction} />
                        <div style={{ paddingLeft: '0.25em' }}>
                            <Typography variant='body1'>Deg</Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>

        </div>
    ), [classes, id, label, directInputOBS, obsValue, entrySetAction, entrySelectAction])
}

export default Obs;