import { createTheme, adaptV4Theme } from '@mui/material/styles';

const globalTheme = createTheme({
    shape: {
        borderRadius: 2
    },
    palette: {
        mode: 'dark',
        background: {
            default: 'rgb(17, 19, 24, 1)',          // almost black
            paper: 'rgb(30, 33, 42, 1)'             // dark grey
        },
        primary: {
            main: 'rgb(112, 115, 192, 1)',          // purple
            dark: 'rgb(82, 83, 124, 1)'             // dark purple grey 
        },
        secondary: {
            main: 'rgb(30, 33, 42, 1)',             // dary grey
            dark: 'rgb(250, 186, 57, 0.1)'          // pale orange - yellow
        },
        action: {
            hover: 'rgb(250, 186, 57, 1)'           // orange - yellow
        },
        divider: 'rgb(54, 58, 71, 1)',              // grey            
        border: 'rgb(54, 58, 71, 1)'                // grey        
    },
});

export const darkTheme = createTheme(adaptV4Theme({
    palette: globalTheme.palette,
    overrides: {
        MuiTypography: {
            root: {
                color: 'rgb(255, 255, 255, 1)'
            },
            body1: { fontSize: '0.7em' },
            body2: { fontSize: '0.6em' },
            subtitle1: { fontSize: '0.75em' },
            subtitle2: { fontSize: '0.65em' },
            h1: { fontSize: '3em' },
            h2: { fontSize: '2em' },
            h3: { fontSize: '1.5em' },
            h4: { fontSize: '1.25em' },
            h5: { fontSize: '1em' },
            h6: { fontSize: '0.8em' }
        },
        MuiAppBar: {
            root: {
                backgroundColor: globalTheme.palette.background.default,
                width: '100%',
                height: '2em',
                padding: '0.25em',
                borderLeft: '1px solid ' + globalTheme.palette.border,
                borderRight: '1px solid ' + globalTheme.palette.border,
                borderBottom: '1px solid ' + globalTheme.palette.border,
            },
        },
        MuiCard: {
            root: {
                padding: 0,
                border: '1px solid ' + globalTheme.palette.border + ' !important'
            }
        },
        MuiCardActions: {
            root: {
                padding: '2px 2px 2px 8px',
                height: '1.5em',
                background: 'linear-gradient(rgb(82, 83, 124, 1) 30%, rgb(17, 19, 24, 1) 99%)',
                zIndex: 100
            }
        },
        MuiCardContent: {
            root: {
                padding: '4px 0px 4px 4px !important',
                backgroundColor: globalTheme.palette.background.default,
            }
        },
        MuiSvgIcon: {
            root: {
                padding: 0,
                '&:hover': {
                    color: globalTheme.palette.action.hover,
                    backgroundColor: 'transparent'
                }
            }
        },
        MuiButton: {
            root: {
                //color: 'rgb(255, 255, 255, 1)',
                [globalTheme.breakpoints.up('sm')]: {
                    minWidth: '3em',
                    minHeight: '2.25em',
                    fontSize: '0.6em'
                },
                [globalTheme.breakpoints.up('md')]: {
                    minWidth: '5em',
                    minHeight: '3.5em',
                    fontSize: '0.6em'
                },
                [globalTheme.breakpoints.up('lg')]: {
                    minWidth: '5em',
                    minHeight: '3.25em',
                    fontSize: '0.7em'
                },
                [globalTheme.breakpoints.up('xlg')]: {
                    minWidth: '5em',
                    minHeight: '3.25em',
                    fontSize: '0.7em'
                },
                padding: '0.5em 0em',
                backgroundColor: globalTheme.palette.primary.main,
                '&:hover': {
                    backgroundColor: globalTheme.palette.primary.main,
                    color: globalTheme.palette.action.hover,
                }
            },
            startIcon: {
                margin: '0 !important'
            }
        },
        MuiSwitch: {
            switchBase: {
                '&.Mui-checked': {
                    color: globalTheme.palette.primary.main + ' !important'
                }
            },
            thumb: {
                color: 'rgb(189, 189, 189, 1)'
            }
        },
        MuiGrid: {
            root: {
                marginTop: '0px',
                marginLeft: '0px',
            },
            item: {
                marginLeft: 0,
                padding: '4px'
            }
        },
        MuiTooltip: {
            tooltip: {
                fontSize: "0.75em",
            }
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgb(10, 10, 10, 0.95)'
            }
        }, 
        MuiDialog:{
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0,
            border: '1px solid ' + globalTheme.palette.border,
            borderRadius: '24px',
            outline: 'none'
        },
        MuiPaper:{
            root: {
                backgroundImage: 'linear-gradient(45deg, rgb(30, 33, 42, 1) 25%, rgb(17, 19, 24, 1) 75%)'
            }
        },
        MuiIconButton:{
            root: {
                padding: 0
            }
        }
    },
    custom: {
        defaultDialog: {
            backgroundColor: globalTheme.palette.background.paper,
            margin: 0,
            padding: 0,
            border: '1px solid ' + globalTheme.palette.border,
            outline: 'none'
        },
        sevenDigitPanelContainer: {
            border: '1px solid ' + globalTheme.palette.border,
            backgroundColor: globalTheme.palette.background.default
        },
        sevenDigitPanelClickableContainer: {
            border: '1px solid ' + globalTheme.palette.border,
            backgroundColor: globalTheme.palette.background.default,
            '&:hover': {
                backgroundColor: globalTheme.palette.secondary.dark,
                cursor: 'pointer'
            }
        },
        panelGrid: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 4px'
            //padding: '0.25em 0.5em 0.5em 0.5em'
        },
        panelSection: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            border: '1px solid ' + globalTheme.palette.border,
            backgroundColor: globalTheme.palette.background.paper,
            //padding: '0.25em',
            minHeight: '3em',
            //flexGrow: 1,
        }
    }
}, globalTheme))