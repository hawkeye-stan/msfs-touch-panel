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
    transponderEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    transponderDigit: {
        paddingLeft: '0.5em'
    },
    gridItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
}));

const Transponder = () => {
    const classes = useStyles();
    const { TRANSPONDER_CODE } = useSimConnectData().simConnectData;
    const { directInputTransponder } = useLocalStorageData().configurationData;

    return useMemo(() => (
        <div className={classes.section}>
            <Grid container>
                <Grid item xs={3} className={classes.gridItem}>
                    <Typography variant='body1'>XPNDR</Typography>
                </Grid>
                <Grid item xs={9} className={classes.gridItem}>
                    <div className={classes.transponderEntry}>
                        {[0, 1, 2, 3].map((digit, index) => {
                            return (
                                <div key={'key' + index} className={classes.transponderDigit}>
                                    <NumericEntryDisplay
                                        id={'transponderEntry' + index}
                                        initialValue={Number(String(TRANSPONDER_CODE).charAt(digit))}
                                        numberOfDigit={1}
                                        minValue={0}
                                        maxValue={7}
                                        disableNumPadKeys={[8, 9, '-']}
                                        directInput={directInputTransponder}
                                        onSet={(value) => simActions.Transponder.set(digit, value, TRANSPONDER_CODE)}
                                        onSelect={() => simActions.Transponder.select(index)} />
                                </div>
                            )
                        })}
                    </div>
                </Grid>
            </Grid>
        </div>
    ), [classes, directInputTransponder, TRANSPONDER_CODE])
}

export default Transponder;