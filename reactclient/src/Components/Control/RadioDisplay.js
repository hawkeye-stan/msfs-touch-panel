import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NumericEntryDisplay from './NumericEntryDisplay';

const useStyles = makeStyles((theme) => ({
    gridItemRadio: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridItemSwap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '2em'
    },
    radioContainer: {
        ...theme.custom.sevenDigitPanelContainer,
    },
    radioClickableContainer: {
        minWidth: '8em',
        ...theme.custom.sevenDigitPanelClickableContainer
    },
    radioText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '0.4em',
        padding: '0em 1em'
    },
}));

const RadioDisplay = ({ id, numberOfDigit, decimalPlaces, activeFreqKey, standbyFreqKey, minFreqValue, maxFreqValue,
radioSelectAction, radioSetAction, radioSwappedAction }) => {
    const classes = useStyles();
    const { simConnectData } = useSimConnectData();
    const { directInputComNav } = useLocalStorageData().configurationData;

    const activeFreq = Number(simConnectData[activeFreqKey]);
    const standbyFreq = Number(simConnectData[standbyFreqKey])

    return useMemo(() => (
        <div>
            <Grid container>
                <Grid item xs={5} className={classes.gridItemRadio}>
                    <NumericEntryDisplay
                        labelLeft={'U S E'}
                        initialValue={activeFreq}
                        numberOfDigit={numberOfDigit}
                        numberOfDisplayDigit={numberOfDigit + 1}
                        decimalPlaces={decimalPlaces}
                        disableEntry={true}
                    />
                </Grid>
                <Grid item xs={2} className={classes.gridItemSwap}>
                    <IconButton color='inherit' aria-label='swap' size='medium' onClick={() => radioSwappedAction()}>
                        <SwapHorizIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={5} className={classes.gridItemRadio}>
                    <NumericEntryDisplay
                        id={id}
                        labelRight={'S T B Y'}
                        initialValue={standbyFreq}
                        numberOfDigit={numberOfDigit}
                        numberOfDisplayDigit={numberOfDigit + 1}
                        decimalPlaces={decimalPlaces}
                        minValue={minFreqValue}
                        maxValue={maxFreqValue}
                        showDualKnob={true}
                        disableNumPadKeys={['-']}
                        directInput={directInputComNav}
                        onSelect={() => radioSelectAction()}
                        onSet={(value) => radioSetAction(value)} />
                </Grid>
            </Grid>
        </div>
    ), [classes, id, numberOfDigit, decimalPlaces, activeFreq, standbyFreq, minFreqValue, maxFreqValue,
        directInputComNav, radioSelectAction, radioSetAction, radioSwappedAction])
}

RadioDisplay.defaultProps = {
    decimalPlaces: 2,
    value: 0
};

export default RadioDisplay;
