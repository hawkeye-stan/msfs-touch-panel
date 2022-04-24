// import React, { useMemo } from 'react';
// import makeStyles from '@mui/styles/makeStyles';
// import { useSimConnectData } from '../Services/DataProviders/SimConnectDataProvider';
// import { Typography } from '@mui/material';
// import Grid from '@mui/material/Grid';

// const useStyles = makeStyles((theme) => ({
//     sectionSmall: {
//         ...theme.custom.panelSection,
//         justifyContent: 'space-around',
//         paddingLeft: '8px',
//         paddingRight: '8px',
//         minHeight: '1.5em',
//             padding: '0px !important'
        
//     },
//     telemetryDisplay: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     segmentDisplay:
//     {
//         display: 'flex',
//         justifyContent: 'center'
//     },
//     dataLabel:
//     {
//         color: 'rgb(32, 217, 32, 1)'
//     }
// }));

// const TelemetryPanel = () => {
//     const classes = useStyles();
//     const onColor = 'rgb(32, 217, 32, 1)';
//     const waitingColor = 'rgb(250, 186, 57, 1)';
//     const offColor = 'rgb(97, 99, 105, 1)';

//     const { ELEVATOR_TRIM_PERCENT, AILERON_TRIM_ANGLE, FLAPS_ANGLE, 
//         ENG_PROP_RPM, ENG_MIXTURE_PERCENT, GEAR_CENTER_POSITION, GEAR_LEFT_POSITION,
//         GEAR_RIGHT_POSITION } = useSimConnectData().simConnectData;

//     const gearColor = (gear) => {
//         if (gear === 0)
//             return offColor;
//         else if (gear === 100)
//             return onColor;
//         else
//             return waitingColor;
//     }

//     return useMemo(() => (
//         <Grid container>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                 <Typography variant='body1'>Elevator Trim:</Typography>
//                 <Typography variant='body1' className={classes.dataLabel}>{ELEVATOR_TRIM_PERCENT} {ELEVATOR_TRIM_PERCENT > 0 ? 'U' : ELEVATOR_TRIM_PERCENT < 0 ? 'D' : ''}</Typography>
                
//             </Grid>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                     <Typography variant='body1'>Aileron Trim:</Typography>
//                     <Typography variant='body1' className={classes.dataLabel}>{AILERON_TRIM_ANGLE} {AILERON_TRIM_ANGLE > 0 ? 'R' : AILERON_TRIM_ANGLE < 0 ? 'L' : ''}</Typography>
//             </Grid>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                     <Typography variant='body1'>Flap:</Typography>
//                     <Typography variant='body1' className={classes.dataLabel}>{FLAPS_ANGLE}</Typography>
//             </Grid>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                     <Typography variant='body1'>Gear:</Typography>
//                     <div><Typography variant='body1' style={{ color: gearColor(GEAR_LEFT_POSITION) }}>L</Typography></div>
//                     <div><Typography variant='body1' style={{ color: gearColor(GEAR_CENTER_POSITION) }}>N</Typography></div>
//                     <div><Typography variant='body1' style={{ color: gearColor(GEAR_RIGHT_POSITION) }}>R</Typography></div>
//             </Grid>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                     <Typography variant='body1'>Prop:</Typography>
//                     <Typography variant='body1' className={classes.dataLabel}>{ENG_PROP_RPM} RPM</Typography>
//             </Grid>
//             <Grid item xs={2} className={classes.sectionSmall}>
//                     <Typography variant='body1'>Mixture:</Typography>
//                     <Typography variant='body1' className={classes.dataLabel}>{ENG_MIXTURE_PERCENT}%</Typography>
//              </Grid>
//         </Grid>
//     ), [classes, FLAPS_ANGLE, ELEVATOR_TRIM_PERCENT, AILERON_TRIM_ANGLE, ENG_PROP_RPM, ENG_MIXTURE_PERCENT,
//         GEAR_CENTER_POSITION, GEAR_LEFT_POSITION, GEAR_RIGHT_POSITION])
// }

// export default TelemetryPanel