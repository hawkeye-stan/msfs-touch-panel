import makeStyles from '@mui/styles/makeStyles';

export const PANEL_CONTROL_STYLE_DEFINITION = {
    DEFAULT_STYLES: makeStyles({
        iframePanelMaxSize: {
            height:  '100%',
            width: '100%',
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            margin: 'auto',
            paddingTop: '0.5em',
            paddingBottom: '0.5em',
            zIndex: 999
        },
    }),

    G1000NXI_STYLES: makeStyles({
        iframePanel_0: {
            position: 'absolute',
            top: (props) => `calc(100% * 43 / ${props.height})`,
            left: (props) => `calc(100% * 186 / ${props.width})`,
            width:  (props) => `calc(100% * 1040 / ${props.width})`,
            height:  (props) => `calc(100% * 776 / ${props.height})`,
            //aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            zIndex: 1001        // allows iframe to response to touch over button overlay
        },
        iframePanelMaxSize: {
            height:   (props) => `calc(100% * 914 / ${props.height})`,
            //aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            margin: 'auto',
            zIndex: 1001        // allows iframe to response to touch over button overlay
        },
        buttonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 56 / ${props.width})`,
            height: (props) => `calc(100% * 37 / ${props.height})`,
            //aspectRatio: 1.5
        },
        knobBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            //aspectRatio: 1
        },
        regularKnob: {
            width: (props) => `calc(100% * 77 / ${props.width})`,
            height: (props) => `calc(100% * 77 / ${props.height})`
        },
        crsKnob: {
            width: (props) => `calc(100% * 79 / ${props.width})`,
            height: (props) => `calc(100% * 79 / ${props.height})`
        },
        volKnob: {
            width: (props) => `calc(100% * 49 / ${props.width})`,
            height: (props) => `calc(100% * 49 / ${props.height})`
        },
        rangeKnob: {
            width: (props) => `calc(100% * 66 / ${props.width})`,
            height: (props) => `calc(100% * 66 / ${props.height})`
        },
    }),

    G1000NXI_COMBO_STYLES: makeStyles({
        iframePanel_0: {
            position: 'absolute',
            top: (props) => `calc(100% * 43 / ${props.height})`,
            left: (props) => `calc(100% * 186 / ${props.width})`,
            width:  (props) => `calc(100% * 1040 / ${props.width})`,
            height:  (props) => `calc(100% * 776 / ${props.height})`,
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            zIndex: 1001        // allows iframe to response to touch over button overlay
        },
        iframePanel_1: {
            position: 'absolute',
            top: (props) => `calc(100% * 43 / ${props.height})`,
            left: (props) => `calc(100% * 1236 / ${props.width})`,
            width:  (props) => `calc(100% * 1040 / ${props.width})`,
            height:  (props) => `calc(100% * 776 / ${props.height})`,
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            zIndex: 1001        // allows iframe to response to touch over button overlay
        },
        iframePanelMaxSize: {
            height:   (props) => `calc(100% * 914 / ${props.height})`,
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            margin: 'auto',
            zIndex: 1001        // allows iframe to response to touch over button overlay
        },
        buttonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 56 / ${props.width})`,
            height: (props) => `calc(100% * 37 / ${props.height})`,
            //aspectRatio: 1.5
        },
        knobBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            //aspectRatio: 1
        },
        regularKnob: {
            width: (props) => `calc(100% * 77 / ${props.width})`,
            height: (props) => `calc(100% * 77 / ${props.height})`
        },
        crsKnob: {
            width: (props) => `calc(100% * 79 / ${props.width})`,
            height: (props) => `calc(100% * 79 / ${props.height})`
        },
        volKnob: {
            width: (props) => `calc(100% * 49 / ${props.width})`,
            height: (props) => `calc(100% * 49 / ${props.height})`
        },
        rangeKnob: {
            width: (props) => `calc(100% * 66 / ${props.width})`,
            height: (props) => `calc(100% * 66 / ${props.height})`
        },
    }),

    FBWA32NX_CDU_STYLES: makeStyles({
        iframePanel_0: {
            position: 'absolute',
            top: (props) => `calc(100% * 49 / ${props.height})`,
            left: (props) => `calc(100% * 60 / ${props.width})`,
            width:  (props) => `calc(100% * 333 / ${props.width})`,
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            zIndex: 999     // have the screen hide below the button overlay
        },
        iframePanelMaxSize: {
            height: (props) => `calc(100% * 674 / ${props.height})`,
            aspectRatio: (props) => `${props.iframeRatio}`,
            border: '0',
            backgroundColor: 'black',
            margin: 'auto',
            zIndex: 1001     // have the screen hide below the button overlay
        },
        squareButtonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 32 / ${props.width})`,
            height: (props) => `calc(100% * 32 / ${props.width})`
            //aspectRatio: 1
        },
        rectangleButtonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 44 / ${props.width})`,
            height: (props) => `calc(100% * 31 / ${props.width})`
            //aspectRatio: 1.41
        },
        selectButtonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 32 / ${props.width})`,
            height: (props) => `calc(100% * 24.6 / ${props.width})`
            //aspectRatio: 1.3
        },
        brightdimButtonBase: {
            position: 'absolute',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            width: (props) => `calc(100% * 34 / ${props.width})`,
            height: (props) => `calc(100% * 34 / ${props.width})`
            //aspectRatio: 1
        }
    })
}