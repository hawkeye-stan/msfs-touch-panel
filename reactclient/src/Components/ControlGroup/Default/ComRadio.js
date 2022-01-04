import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RadioDisplay from '../../Control/RadioDisplay';

const useStyles = makeStyles((theme) => ({
    section: theme.custom.panelSection,
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    
}));

const ComRadio = ({ id, label, transmitOnKey, activeFreqKey, standbyFreqKey, transmitChangedAction, radioSelectAction, radioSetAction, radioSwappedAction }) => {
    const classes = useStyles();
    const onColor = 'rgb(32, 217, 32, 1)';

    const { simConnectData } = useSimConnectData();
    const transmitOn = Boolean(simConnectData[transmitOnKey]);

    return (
        <div className={classes.section}>
            <Grid container>
                <Grid item xs={2} className={classes.gridItem}>
                    <Button
                        variant="contained"
                        size='small'
                        color='primary'
                        style={{ backgroundColor: transmitOn ? onColor : '', minWidth: '4.5em' }}
                        onClick={() => transmitChangedAction(Number(!transmitOn))}>
                        {label}
                    </Button>
                </Grid>
                <Grid item xs={10} className={classes.gridItem}>
                    <RadioDisplay
                        id={id}
                        numberOfDigit={6}
                        decimalPlaces={3}
                        activeFreqKey={activeFreqKey}
                        standbyFreqKey={standbyFreqKey}
                        minFreqValue={118}
                        maxFreqValue={136.99}
                        radioSelectAction={radioSelectAction}
                        radioSetAction={radioSetAction}
                        radioSwappedAction={radioSwappedAction} />
                </Grid>
            </Grid>
        </div>
    )
}

export default ComRadio;