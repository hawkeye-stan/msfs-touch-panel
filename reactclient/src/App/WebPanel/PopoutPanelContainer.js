import React, { useState, useRef, useEffect, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import KnobPadOverlay from '../../Components/ControlDialog/KnobPadOverlay';
import ButtonTemplate from './ButtonTemplate';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        height: '100%',
        aspectRatio: (props) => props.panelRatio,
        margin: '0 auto'
    },
    buttonOverlay:
    {
        position: 'relative',
        backgroundColor: theme.palette.background,
        backgroundImage: (props) => `url(/img/${props.planeId}/${props.panelId}/background.png)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        width: '100%',
        height: '100%',
        //aspectRatio: (props) => props.panelRatio,
        zIndex: 1000
    },
    iframe: {
        width: '100%',
        height: '100%',
    }
}));

const PopoutPanelContainer = ({panelInfo, displayFormat}) => {
    const { simConnectSystemEvent } = useSimConnectData();
    const { isUsedArduino } = useLocalStorageData().configurationData;
    const sharedClasses = useStyles(panelInfo[0]);
    const panelClasses = panelInfo[0].styles(panelInfo[0]);
    const [reload, setReload] = useState(true);
    const [keyPadOpen, setKeyPadOpen] = useState(false);
    const [showDualKnob, setShowDualKnob] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const knobPadTimeout = useRef();

    const handleKeyPadClose = () => {
        setKeyPadOpen(false);
    }

    const handleShowEncoder = (event, useDualEncoder) => {
        setShowDualKnob(useDualEncoder)
        
        setAnchorEl(event.currentTarget);
        if (!isUsedArduino)
            setKeyPadOpen(true);

        clearTimeout(knobPadTimeout.current);
        knobPadTimeout.current = setTimeout(() => setKeyPadOpen(false), 12000);
    }

    const handleOnKnobPadActivate = () => {
        clearTimeout(knobPadTimeout.current);
        knobPadTimeout.current = setTimeout(() => setKeyPadOpen(false), 12000);
    }

    useEffect(() =>{
        if(simConnectSystemEvent !== null)
        {
            if(simConnectSystemEvent === 'SIMSTART')
                setReload(true);
            else if(simConnectSystemEvent === 'SIMSTOP')
                setReload(false);
        }
    }, [simConnectSystemEvent])

    
    return useMemo(() => (
        <div className={sharedClasses.root}>
            {reload && (displayFormat.toLowerCase() === 'buttonpanel' || displayFormat.toLowerCase() === 'webpanel') && 
                panelInfo.map((panel, index) => { 
                    return (
                        <div key={'atc' + index} className={displayFormat.toLowerCase() === 'webpanel' ? panelClasses.iframePanelMaxSize : panelClasses['iframePanel_' + index]}>
                            <iframe title='iframePanel' className={sharedClasses.iframe} src={`/assets/webpanel.html?planeId=${panel.planeId}&panelId=${panel.panel_coherent_id}`} frameBorder="0"></iframe>
                        </div>
                    )}
                )}
            { reload && (displayFormat.toLowerCase() === 'buttonpanel' || displayFormat.toLowerCase() === 'framepanel') &&
                <div className={sharedClasses.buttonOverlay}>
                    { panelInfo[0].definitions !== undefined && panelInfo[0].definitions.map(btn =>
                        <ButtonTemplate 
                            key={btn.id} 
                            btn={btn} 
                            panelInfo={panelInfo}
                            showEncoder={(e, useDualEncoder) => handleShowEncoder(e, useDualEncoder)}>
                        </ButtonTemplate>
                    )}
                </div>
            }
            {!isUsedArduino && keyPadOpen &&
                <KnobPadOverlay
                    open={keyPadOpen}
                    onClose={handleKeyPadClose}
                    allowInputOption={false}
                    showDualKnob={showDualKnob}
                    anchorEl={anchorEl}
                    onKnobPadActivate={() => handleOnKnobPadActivate()}>
                </KnobPadOverlay>
            }
        </div>
    ), [panelInfo, keyPadOpen])
}

export default PopoutPanelContainer;