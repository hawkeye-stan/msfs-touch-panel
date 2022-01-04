import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import RadioDisplay from '../../Control/RadioDisplay';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
    section: theme.custom.panelSection,
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 0
    },
}));

const NavRadio = ({ id, label, activeFreqKey, standbyFreqKey, radioSelectAction, radioSetAction, radioSwappedAction }) => {
    const classes = useStyles();

    return (
        <div className={classes.section}>
            <Grid container>
                <Grid item xs={2} className={classes.gridItem}>
                    <Typography variant='body1'>{label}</Typography>
                </Grid>
                <Grid item xs={10} className={classes.gridItem}>
                    <RadioDisplay
                        id={id}
                        numberOfDigit={5}
                        decimalPlaces={2}
                        activeFreqKey={activeFreqKey}
                        standbyFreqKey={standbyFreqKey}
                        minFreqValue={108}
                        maxFreqValue={117.99}
                        radioSelectAction={radioSelectAction}
                        radioSetAction={radioSetAction}
                        radioSwappedAction={radioSwappedAction} />
                </Grid>
            </Grid>
        </div>
    )
}

export default NavRadio;