import * as PopoutPanelDefinition from './PopoutPanelDefinition';
import * as PopoutPanelStyles from './PopoutPanelStyles';

export const PLANE_PROFILE_INFO = [
    { id: 'g1000nxi', name: 'G1000NXi Enabled Plane', 
        panels: [
            { id: 'pfd', name: 'PFD', type: 'buttonpanel', hasMap: true, hasTelemetryDisplay: true, 
                panelInfo: { planeId: 'g1000nxi', panelId: 'pfd', panel_coherent_id: 'wtg1000_pfd', width: 1408, height: 914, panelRatio: 1408/914, iframeRatio: 1024/768, definitions: PopoutPanelDefinition.G1000NXI_PFD_DEF, styles: PopoutPanelStyles.G1000NXI_STYLES} },
            { id: 'pfd', name: 'PFD (Without button overlay)', type: 'webpanel', hasMap: true, hasTelemetryDisplay: true, 
                panelInfo: { planeId: 'g1000nxi', panelId: 'pfd', panel_coherent_id: 'wtg1000_pfd', width: 1408, height: 914, panelRatio: 1408/914, iframeRatio: 1024/768, definitions: [], styles: PopoutPanelStyles.G1000NXI_STYLES} },
            { id: 'mfd', name: 'MFD', type: 'buttonpanel', hasMap: true, hasTelemetryDisplay: true, 
                panelInfo: { planeId: 'g1000nxi', panelId: 'mfd', panel_coherent_id: 'as1000_mfd', width: 1408, height: 914, panelRatio: 1408/914, iframeRatio: 1024/768, definitions: PopoutPanelDefinition.G1000NXI_MFD_DEF, styles: PopoutPanelStyles.G1000NXI_STYLES} },
            { id: 'mfd', name: 'MFD (Without button overlay)', type: 'webpanel', hasMap: true, hasTelemetryDisplay: true, 
                panelInfo: { planeId: 'g1000nxi', panelId: 'mfd', panel_coherent_id: 'as1000_mfd', width: 1408, height: 914, panelRatio: 1408/914, iframeRatio: 1024/768, definitions: [], styles: PopoutPanelStyles.G1000NXI_STYLES} }
        ]
    },
    { id: 'fbwa32nx', name: 'FlyByWire A32NX', 
        panels: [
            { id: 'pfd', name: 'PFD', type: 'webpanel', hasMap: false, hasTelemetryDisplay: false, 
                panelInfo: { planeId: 'fbwa32nx', panelId: 'pfd', panel_coherent_id: 'pfd_template_1', width: '100%', height: '100%', iframeRatio: 1, definitions: [], styles: PopoutPanelStyles.DEFAULT_STYLES }},
            { id: 'nd', name: 'Navigation Display', type: 'webpanel', hasMap: false, hasTelemetryDisplay: false,
                panelInfo: { planeId: 'fbwa32nx', panelId: 'nd', panel_coherent_id: 'nd_template_1',width: '100%', height: '100%', iframeRatio: 1, definitions: [], styles: PopoutPanelStyles.DEFAULT_STYLES }}, 
            { id: 'eicas_1', name: 'ECAM 1', type: 'webpanel', hasMap: false, hasTelemetryDisplay: false, 
                panelInfo: { planeId: 'fbwa32nx', panelId: 'eicas_1', panel_coherent_id: 'eicas_1',width: '100%', height: '100%', iframeRatio: 1, definitions: [], styles: PopoutPanelStyles.DEFAULT_STYLES }},
            { id: 'eicas_2', name: 'ECAM 2', type: 'webpanel', hasMap: false, hasTelemetryDisplay: false, 
                panelInfo: { planeId: 'fbwa32nx', panelId: 'eicas_2', panel_coherent_id: 'eicas_2', width: '100%', height: '100%', iframeRatio: 1, definitions: [], styles: PopoutPanelStyles.DEFAULT_STYLES }},
            { id: 'cdu', name: 'Multipurpose Control Display Unit (MCDU)', type: 'buttonpanel', hasMap: false, hasTelemetryDisplay: false, 
                panelInfo: { planeId: 'fbwa32nx', panelId: 'cdu', panel_coherent_id: 'a320_neo_cdu', width: 446, height: 674, panelRatio: 446/674, iframeRatio: 333/255, definitions: PopoutPanelDefinition.FBWA32NX_CDU_DEF, styles: PopoutPanelStyles.FBWA32NX_CDU_STYLES} },
        ]
    },
]