import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useLocalStorageData } from '../../../Services/LocalStorageProvider';
import NumericEntryDisplay from '../../Control/NumericEntryDisplay';

const useStyles = makeStyles(() => ({
    adfEntry: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adfDigit: {
        padding: '0em 0.15em'
    },
}));

const AdfDisplay = ({ Frequency, disableEntry, onSet, onSelect }) => {
    const classes = useStyles();
    const { directInputADF } = useLocalStorageData().configurationData;

    const handleOnSet = (digit, value) => {
        if (onSet != null)
            onSet(digit, value);
    }

    const handleOnSelect = (digit) => {
        if (onSelect != null)
            onSelect(digit);
    }

    return (
        <div className={classes.adfEntry}>
            <div className={classes.adfDigit}>
                <NumericEntryDisplay
                    id={'adfEntry1'}
                    initialValue={Number(String(Frequency).slice(0, 2))}
                    numberOfDigit={2}
                    numberOfDisplayDigit={2}
                    minValue={0}
                    maxValue={17}
                    disableNumPadKeys={['-']}
                    directInput={directInputADF}
                    disableEntry={disableEntry}
                    onSet={(value) => handleOnSet(0, value)}
                    onSelect={() => handleOnSelect(0)} />
            </div>
            <div className={classes.adfDigit}>
                <NumericEntryDisplay
                    id={'adfEntry2'}
                    initialValue={Number(String(Frequency).charAt(2))}
                    numberOfDigit={1}
                    numberOfDisplayDigit={1}
                    minValue={0}
                    maxValue={9}
                    disableNumPadKeys={['-']}
                    directInput={directInputADF}
                    disableEntry={disableEntry}
                    onSet={(value) => handleOnSet(1, value)}
                    onSelect={() => handleOnSelect(1)} />
            </div>
            <div className={classes.adfDigit}>
                <NumericEntryDisplay
                    id={'adfEntry3'}
                    initialValue={Number(String(Frequency).charAt(3))}
                    numberOfDigit={1}
                    numberOfDisplayDigit={1}
                    minValue={0}
                    maxValue={9}
                    disableNumPadKeys={['-']}
                    directInput={directInputADF}
                    disableEntry={disableEntry}
                    onSet={(value) => handleOnSet(2, value)}
                    onSelect={() => handleOnSelect(2)} />
            </div>
        </div>
    )
}

export default AdfDisplay;