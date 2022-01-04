import React, { useState, useEffect, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';
import { simConnectPost } from '../../Services/ActionProviders/simConnectPost';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import KnobPadOverlay from '../../Components/ControlDialog/KnobPadOverlay';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        height: '100%'
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
        zIndex: 1000
    },
    iframe: {
        width: '100%',
        height: '100%',
    },
    iconButton: {
        width: '100%',
        height: '100%'
    },
    iconImageHighlight: {
        filter: 'brightness(200%)',
    }
}));

const PopoutPanelContainer = ({panelInfo, displayFormat}) => {
    const { simConnectSystemEvent } = useSimConnectData();
    const { isUsedArduino } = useLocalStorageData().configurationData;
    const sharedClasses = useStyles(panelInfo);
    const panelClasses = panelInfo.styles(panelInfo);
    const [activeButton, setActiveButton] = useState();
    const [reload, setReload] = useState(true);
    const [keyPadOpen, setKeyPadOpen] = useState(false);
    const [showDualKnob, setShowDualKnob] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const setupButtonClasses = (btn) => {
        var styleClasses = [];

        for(let i = 0; i < btn.classes.length; i++)
            styleClasses.push(panelClasses[btn.classes[i]]);

        styleClasses.push(activeButton === btn.id ? sharedClasses.iconImageHighlight : '');

        return styleClasses.join(' ');
    }

    const setupButtonStyles = (btn) => {
        let style = {backgroundImage: `url(/img/${panelInfo.planeId}/${btn.image})`, left: (btn.left / panelInfo.width * 100.0) + '%', top: (btn.top / panelInfo.height * 100.0) + '%'};
        return style;
    }

    const handleOnClick = (event, button) => {
        if (button.action !== undefined && button.action !== null)
            simConnectPost(button.action, 1)
       
        setActiveButton(button.id);

        if(button.useEncoder || button.useDualEncoder)
        {
            setShowDualKnob(button.useDualEncoder)

            setAnchorEl(event.currentTarget);
            if (!isUsedArduino)
                setKeyPadOpen(!keyPadOpen);
        }
    }

    const handleKeyPadClose = () => {
        setKeyPadOpen(!keyPadOpen);
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
                <div className={displayFormat.toLowerCase() === 'webpanel' ? panelClasses.iframePanelMaxSize : panelClasses.iframePanel}>
                    <iframe title='iframePanel' className={sharedClasses.iframe} src={`/assets/webpanel.html?planeId=${panelInfo.planeId}&panelId=${panelInfo.panelId}`} frameBorder="0"></iframe>
                </div> 
            }
            { reload && (displayFormat.toLowerCase() === 'buttonpanel' || displayFormat.toLowerCase() === 'framepanel') &&
                <div className={sharedClasses.buttonOverlay}>
                    { panelInfo.definitions !== undefined && panelInfo.definitions.map(btn =>
                        <div key={btn.id} className={setupButtonClasses(btn)} style={setupButtonStyles(btn)}>
                            <IconButton className={sharedClasses.iconButton} onClick={(event) => handleOnClick(event, btn)} />
                        </div>
                    )}
                </div>
            }
            {!isUsedArduino && keyPadOpen &&
                <KnobPadOverlay
                    open={keyPadOpen}
                    onClose={handleKeyPadClose}
                    allowInputOption={false}
                    showDualKnob={showDualKnob}
                    anchorEl={anchorEl}>
                </KnobPadOverlay>
            }
        </div>
    ), [panelInfo, activeButton, keyPadOpen])
}

export default PopoutPanelContainer;