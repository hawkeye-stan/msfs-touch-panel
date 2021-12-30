import { simConnectPost } from './simConnectPost';

export const simActions = {
    ATC: {
        select: (index) => simConnectPost('ATC_MENU_' + index, 1)
    },

    Autopilot: {
        apMaster: () => simConnectPost('AP_MASTER', 1),
        flightDirector: () => simConnectPost('TOGGLE_FLIGHT_DIRECTOR', 1),
        cdi: () => simConnectPost('TOGGLE_GPS_DRIVES_NAV1', 1),
        nav: () => simConnectPost('AP_NAV1_HOLD', 1),
        yawDamper: () => simConnectPost('YAW_DAMPER_TOGGLE', 1),
        autoThrottle: () => simConnectPost('AUTO_THROTTLE_ARM', 1),
        approach: () => simConnectPost('AP_APR_HOLD', 1),
        backCourse: () => simConnectPost('AP_BC_HOLD', 1),
        vnav: () => simConnectPost('AS1000_AP_VNAV_Push', 1),
        leveler: () => simConnectPost('AP_WING_LEVELER', 1),

        Altitude: {
            hold: () => simConnectPost('AP_PANEL_ALTITUDE_HOLD', 1),
            select: () => simConnectPost('ALTITUDE_BUG_SELECT', 1),
            set: (value) => simConnectPost('AP_ALT_VAR_SET_ENGLISH', value),
            sync: (value) => simConnectPost('AP_ALT_SYNC', value),
        },
        Heading: {
            hold: () => simConnectPost('AP_PANEL_HEADING_HOLD', 1),
            select: () => simConnectPost('HEADING_BUG_SELECT', 1),
            set: (value) => simConnectPost('HEADING_BUG_SET', value),
            sync: (value) => simConnectPost('HEADING_BUG_SYNC', value),
        },
        VS: {
            hold: () => simConnectPost('AP_VS_HOLD', 1),
            select: () => simConnectPost('VSI_BUG_SELECT', 1),
            set: (value) => simConnectPost('AP_VS_VAR_SET_ENGLISH', value),
            increase: () => simConnectPost('AP_VS_VAR_INC', 1),
            decrease: () => simConnectPost('AP_VS_VAR_DEC', 1),
        },
        FLC: {
            hold: () => simConnectPost('AS1000_MFD_FLC_Push', 1),
            select: () => simConnectPost('AIRSPEED_BUG_SELECT', 1),
            set: (value) => simConnectPost('AP_SPD_VAR_SET', value),
            increase: () => simConnectPost('AP_SPD_VAR_INC', 1),
            decrease: () => simConnectPost('AP_SPD_VAR_DEC', 1),
        }
    },

    Barometer: {
        select: () => simConnectPost('BAROMETER_SELECT', 1),
        set: (value) => simConnectPost('KOHLSMAN_SET', value)
    },

    Communication: {
        COM1: {
            select: () => simConnectPost('COM1_SELECT', 1),
            set: (value) => simConnectPost('COM_STBY_RADIO_SET', value),
            swap: () => simConnectPost('COM_STBY_RADIO_SWAP', 1),
            toggle: (value) => simConnectPost('COM1_TRANSMIT_SELECT', value)
        },
        COM2: {
            select: () => simConnectPost('COM2_SELECT', 1),
            set: (value) => simConnectPost('COM2_STBY_RADIO_SET', value),
            swap: () => simConnectPost('COM2_RADIO_SWAP', 1),
            toggle: (value) => simConnectPost('COM2_TRANSMIT_SELECT', value)
        }
    },

    Electrical: {
        Master: {
            battery: (value) => simConnectPost('TOGGLE_MASTER_BATTERY' , value),
            alternator: (value) => simConnectPost('TOGGLE_MASTER_ALTERNATOR', value)
        },
        Avionic: {
            master: (value) => simConnectPost('AVIONICS_MASTER_SET', value),
            fuelPump: (value) => simConnectPost('TOGGLE_ELECT_FUEL_PUMP', value),
            pitotHeat: (value) => simConnectPost('PITOT_HEAT_TOGGLE', value),
            deIce: (value) => simConnectPost('ANTI_ICE_SET', value)
        },
        Light: {
            beacon: (value) => simConnectPost('TOGGLE_BEACON_LIGHTS' , value),
            landing: (value) => simConnectPost('LANDING_LIGHTS_TOGGLE', value),
            taxi: (value) => simConnectPost('TOGGLE_TAXI_LIGHTS', value),
            nav: (value) => simConnectPost('TOGGLE_NAV_LIGHTS', value),
            strobe: (value) => simConnectPost('STROBES_TOGGLE', value),
            panel: (value) => simConnectPost('PANEL_LIGHTS_TOGGLE', value)
        }
    },

    Navigation: {
        NAV1: {
            select: () => simConnectPost('NAV1_SELECT', 1),
            set: (value) => simConnectPost('NAV1_STBY_SET', value),
            swap: () => simConnectPost('NAV1_RADIO_SWAP', 1),
        },
        NAV2: {
            select: () => simConnectPost('NAV2_SELECT', 1),
            set: (value) => simConnectPost('NAV2_STBY_SET', value),
            swap: () => simConnectPost('NAV2_RADIO_SWAP', 1),
        },
        ADF: {
            select: (digitIndex) => simConnectPost('ADF_DIGIT' + (digitIndex + 1) + '_SELECT', 1),
            set: (digitIndex, value, adfValue) => {
                switch (digitIndex) {
                    case 0:
                        adfValue = value + adfValue.substring(adfValue.length - 2);
                        break;
                    case 1:
                        adfValue = adfValue.substring(0, adfValue.length - 2) + value + adfValue.substring(adfValue.length - 1);
                        break;
                    case 2:
                        adfValue = adfValue.substring(0, adfValue.length - 1) + value;
                        break;
                    default:
                }

                simConnectPost('ADF_COMPLETE_SET', adfValue);
            },
            swap: () => simConnectPost('ADF1_RADIO_SWAP', 1),
            cardSelect: () => simConnectPost('ADF_CARD_SELECT', 1),
            cardSet: (value) => simConnectPost('ADF_CARD_SET', value)
        },
        OBS1: {
            select: () => simConnectPost('VOR1_SELECTED' , 1),
            set: (value) => simConnectPost('VOR1_SET' , value)
        },
        OBS2: {
            select: () => simConnectPost('VOR2_SELECTED', 1),
            set: (value) => simConnectPost('VOR2_SET', value)
        },
        DME1: {
            toggle: () => simConnectPost('DME1_TOGGLE', 1),
        },
        DME2: {
            toggle: () => simConnectPost('DME2_TOGGLE', 1),
        }
    },

    Transponder: {
        select: (digitIndex) => simConnectPost('XPNDR_DIGIT' + (digitIndex + 1) + '_SELECT', 1),
        set: (digitIndex, value, xpndrValue) => {
            let xpndr = xpndrValue.split('');
            xpndr[digitIndex] = value;
            xpndr = Number(xpndr.join(''));
            simConnectPost('XPNDR_SET', xpndr);
        }
    },

    SimRate : {
        increase: () => simConnectPost('SIM_RATE_INCR', 1),
        decrease: () => simConnectPost('SIM_RATE_DECR', 1),
    },
}