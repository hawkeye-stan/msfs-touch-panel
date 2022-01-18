import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material'
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DualKnob from '../Control/DualKnob';
import Popover from '@mui/material/Popover';
import { simActions } from '../../Services/ActionProviders/simConnectActionHandler';

const useStyles = makeStyles((theme) => ({
    dialog: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        backgroundColor: 'transparent',
        opacity: 0.6,
        '& .MuiPopover-paper':
        {
            backgroundImage: 'none !important',
            backgroundColor: 'transparent',
            border: '0 !important',
            boxShadow: 'none'
        }
    },
    paper: {
        ...theme.custom.defaultDialog,
        width: '255px',
        height: '255px',
        backgroundColor: 'transparent',
        border: '1px solid transparent'
    },
    controlBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '3em',
        padding: '0 8px'
    },
    directInputSwitch: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numericDisplay: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        border: '1px solid ' + theme.palette.border
    },
    knob: {
        [theme.breakpoints.up('sm')]: { marginTop: '100px' },
        [theme.breakpoints.up('md')]: { marginTop: '125px' }
    },

}));

const KnobOverlay = ({ open, onClose, anchorEl, isDirectInput, onDirectInputChanged, allowInputOption = true, showDualKnob = false }) => {
    const classes = useStyles();

    const handleClose = () => {
        if (onClose !== undefined)
            onClose();
    }

    const HandleUpperKnobIncrease = () => {
        simActions.Encoder.upperIncrease();
    }

    const HandleUpperKnobDecrease = () => {
        simActions.Encoder.upperDecrease();
    }

    const HandleLowerKnobIncrease = () => {
        simActions.Encoder.lowerIncrease();
    }

    const HandleLowerKnobDecrease = () => {
        simActions.Encoder.lowerDecrease();
    }

    const HandleEncoderPush = () => {
        simActions.Encoder.push();
    }

    const handleDirectInputChanged = () => {
        if (onDirectInputChanged != null)
            onDirectInputChanged(true);
    }

    return (
        <Popover 
            aria-labelledby='KnobPad' 
            aria-describedby='KnobPad' 
            anchorEl={anchorEl} 
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
                }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            className={classes.dialog} 
            open={open} 
            onClose={handleClose}
        >
            { allowInputOption && 
                <div className={classes.controlBar}>
                    <IconButton color='inherit' aria-label='close' size='medium' onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <div className={classes.directInputSwitch}>
                        <Typography variant='h6' style={{ paddingRight: '8px' }}>Direct Input</Typography>
                        <Switch
                            checked={!isDirectInput}
                            onChange={handleDirectInputChanged}
                            color='primary'
                            size='small'
                        />
                        </div>
                    <div>&nbsp;</div>
                </div>
            }
            <div className={classes.paper}>
                <div className={classes.knob}>
                    <DualKnob
                        onUpperKnobIncrease={HandleUpperKnobIncrease}
                        onUpperKnobDecrease={HandleUpperKnobDecrease}
                        onLowerKnobIncrease={HandleLowerKnobIncrease}
                        onLowerKnobDecrease={HandleLowerKnobDecrease}
                        onKnobPush={HandleEncoderPush}
                        showKnobButton={true}
                        showDualKnob={showDualKnob}>
                    </DualKnob>
                </div>
            </div>
        </Popover>
    )
}

export default KnobOverlay;