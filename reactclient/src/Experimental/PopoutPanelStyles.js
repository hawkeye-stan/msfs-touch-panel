import makeStyles from '@mui/styles/makeStyles';

export const G1000NXI_STYLES = props => makeStyles({
    iframePanel: {
        position: 'absolute',
        top: `calc(100% * 43 / ${props.height})`,
        left: `calc(100% * 186 / ${props.width})`,
        width:  `calc(100% * 1034 / ${props.width})`,
        aspectRatio: `${props.iframeRatio}`,
        border: '0',
        backgroundColor: 'black',
        zIndex: 1001        // allows iframe to response to touch over button overlay
    },
    buttonBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        width: `calc(100% * 56 / ${props.width})`,
        aspectRatio: 1.5
    },
    knobBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        aspectRatio: 1
    },
    regularKnob: {
        width: `calc(100% * 77 / ${props.width})`,
    },
    crsKnob: {
        width: `calc(100% * 79 / ${props.width})`,
    },
    volKnob: {
        width: `calc(100% * 49 / ${props.width})`
    },
    rangeKnob: {
       width: `calc(100% * 66 / ${props.width})`
    },
});

export const FBWA32NX_CDU_STYLES = props => makeStyles({
    iframePanel: {
        position: 'absolute',
        top: `calc(100% * 49 / ${props.height})`,
        left: `calc(100% * 60 / ${props.width})`,
        width:  `calc(100% * 333 / ${props.width})`,
        aspectRatio: `${props.iframeRatio}`,
        border: '0',
        backgroundColor: 'black',
        zIndex: 999     // have the screen hide below the button overlay
    },
    squareButtonBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        width: `calc(100% * 32 / ${props.width})`,
        aspectRatio: 1
    },
    rectangleButtonBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        width: `calc(100% * 44 / ${props.width})`,
        aspectRatio: 1.41
    },
    selectButtonBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        width: `calc(100% * 32 / ${props.width})`,
        aspectRatio: 1.3
    },
    brightdimButtonBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        width: `calc(100% * 34 / ${props.width})`,
        aspectRatio: 1
    }
});