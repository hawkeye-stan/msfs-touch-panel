import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import { simActions } from '../../../Services/ActionProviders/simConnectActionHandler';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';

const useStyles = makeStyles((theme) => ({
    section: theme.custom.panelSection,
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    adfEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    adfDigit: {
        paddingLeft: '0.5em'
    },
    adfCardEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
}));

const Adf = () => {
    const classes = useStyles();
    const { ADF1_ACTIVE_FREQUENCY, ADF_CARD } = useSimConnectData().simConnectData;
    const { directInputADF } = useLocalStorageData().configurationData;

    return useMemo(() => (
        <div className={classes.section}> 
            <Grid container>
                <Grid item xs={6} className={classes.gridItem}>
                    <Typography variant='body1'>ADF</Typography>
                    <div className={classes.adfEntry}>
                        <div className={classes.adfDigit}>
                            <NumericEntryDisplay
                                id={'adfEntry1'}
                                initialValue={Number(String(ADF1_ACTIVE_FREQUENCY).slice(0, 2))}
                                numberOfDigit={2}
                                numberOfDisplayDigit={2}
                                minValue={0}
                                maxValue={17}
                                disableNumPadKeys={['-']}
                                directInput={directInputADF}
                                onSet={(value) => simActions.Navigation.ADF.set(0, value, ADF1_ACTIVE_FREQUENCY)}
                                onSelect={() => simActions.Navigation.ADF.select(0)} />
                        </div>
                        <div className={classes.adfDigit}>
                            <NumericEntryDisplay
                                id={'adfEntry2'}
                                initialValue={Number(String(ADF1_ACTIVE_FREQUENCY).charAt(2))}
                                numberOfDigit={1}
                                numberOfDisplayDigit={1}
                                minValue={0}
                                maxValue={9}
                                disableNumPadKeys={['-']}
                                directInput={directInputADF}
                                onSet={(value) => simActions.Navigation.ADF.set(1, value, ADF1_ACTIVE_FREQUENCY)}
                                onSelect={() => simActions.Navigation.ADF.select(1)} />
                        </div>
                        <div className={classes.adfDigit}>
                            <NumericEntryDisplay
                                id={'adfEntry3'}
                                initialValue={Number(String(ADF1_ACTIVE_FREQUENCY).charAt(3))}
                                numberOfDigit={1}
                                numberOfDisplayDigit={1}
                                minValue={0}
                                maxValue={9}
                                disableNumPadKeys={['-']}
                                directInput={directInputADF}
                                onSet={(value) => simActions.Navigation.ADF.set(2, value, ADF1_ACTIVE_FREQUENCY)}
                                onSelect={() => simActions.Navigation.ADF.select(2)} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} className={classes.gridItem}>
                    <Typography variant='body1'>CARD</Typography>
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
        </div>
    ), [classes, directInputADF, ADF1_ACTIVE_FREQUENCY, ADF_CARD])
}

export default Adf;