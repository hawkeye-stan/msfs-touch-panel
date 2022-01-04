import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import { simActions } from '../../../Services/ActionProviders/simConnectActionHandler';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';
import AdfDisplay from './AdfDisplay';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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
    gridItemSwap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '2em'
    },
    adfDisplayLabel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.4em',
        padding: '0em 1em 0em 1em',
        width: '2em'
    },
    adfEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    adfCardEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
}));

const Adf = () => {
    const classes = useStyles();
    const { ADF1_ACTIVE_FREQUENCY, ADF1_STANDBY_FREQUENCY, ADF_CARD, ADF_SELECTED } = useSimConnectData().simConnectData;
    const { directInputADF } = useLocalStorageData().configurationData;

    const handleOnSet = (digit, value) => {
        simActions.Navigation.ADF.set(digit, value, ADF1_STANDBY_FREQUENCY);
    }

    const handleOnSelect = (digit) => {
        simActions.Navigation.ADF.select(digit);
    }

    const handleOnSwap = () => {
        simActions.Navigation.ADF.swap();
    }

    return useMemo(() => (
        <div className={classes.section}>
            <Grid container>
                <Grid item container xs={8} className={classes.gridItem}>
                    <Grid item xs={2} className={classes.gridItem}>
                        <Typography variant='body1'>ADF</Typography>
                    </Grid>
                    <Grid item xs={10} className={classes.gridItem}>
                        <div>
                            <Grid container>
                                <Grid item xs={5} className={classes.gridItem}>
                                    <Typography className={classes.adfDisplayLabel} variant='body1'>U S E</Typography>
                                    <AdfDisplay
                                        Label='ADF'
                                        Frequency={ADF1_ACTIVE_FREQUENCY}
                                        disableEntry={true}>
                                    </AdfDisplay>
                                </Grid>
                                <Grid item xs={2} className={classes.gridItemSwap}>
                                    <IconButton color='inherit' aria-label='swap' size='medium' onClick={handleOnSwap}>
                                        <SwapHorizIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={5} className={classes.gridItem}>
                                    <AdfDisplay
                                        Frequency={ADF1_STANDBY_FREQUENCY}
                                        onSet={handleOnSet}
                                        onSelect={handleOnSelect}>
                                    </AdfDisplay>
                                    <Typography className={classes.adfDisplayLabel} variant='body1'>S T B Y</Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
                <Grid item container xs={4} className={classes.gridItem}>
                    <Grid item xs={4} className={classes.gridItem}>
                        <Typography variant='body1'>CARD</Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.gridItem} style={{paddingLeft: '12px'}}>
                        <div className={classes.adfCardEntry}>
                            <NumericEntryDisplay
                                id={'adfCardEntry'}
                                initialValue={ADF_CARD}
                                numberOfDigit={3}
                                numberOfDisplayDigit={3}
                                disableNumPadKeys={['-']}
                                minValue={0}
                                maxValue={359}
                                directInput={directInputADF}
                                onSet={simActions.Navigation.ADF.cardSet}
                                onSelect={simActions.Navigation.ADF.cardSelect} />
                            <div style={{ paddingLeft: '0.25em' }}>
                                <Typography variant='body1'>Deg</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    ), [classes, directInputADF, ADF1_ACTIVE_FREQUENCY, ADF1_STANDBY_FREQUENCY, ADF_CARD, ADF_SELECTED])
}

export default Adf;