import { simConnectPost } from './simConnectPost';

export const simActions = {
    Encoder: {
        upperIncrease: () => simConnectPost('UPPER_ENCODER_INC', 1),
        upperDecrease: () => simConnectPost('UPPER_ENCODER_DEC', 1),
        lowerIncrease: () => simConnectPost('LOWER_ENCODER_INC', 1),
        lowerDecrease: () => simConnectPost('LOWER_ENCODER_DEC', 1),
        push: () => simConnectPost('ENCODER_PUSH', 1),
    },

    SimRate : {
        increase: () => simConnectPost('SIM_RATE_INCR', 1),
        decrease: () => simConnectPost('SIM_RATE_DECR', 1),
    }
}