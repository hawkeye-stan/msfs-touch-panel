import React, { useState, useEffect, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';

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
    const sharedClasses = useStyles(panelInfo);
    const panelClasses = panelInfo.styles(panelInfo);
    const [activeButton, setActiveButton] = useState();
    const [reload, setReload] = useState(true);
        
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

    const setupButtonAction = (actions) => {
        if (Array.isArray(actions))
        {
            var selectedAction = actions.find(x => x.element === activeButton);

            if(selectedAction !== undefined)
                return selectedAction.action;

            return null;
        }
        else
            return actions;
    }

    const handleOnClick = (action, button) => {
        if (action !== undefined && action !== null)
            action();

        // one off for G1000Nxi nose up and nose down button. Do not active button
        if(panelInfo.planetype === 'g1000nxi' && (button === 'btn_nose_up' || button === 'btn_nose_down'))
            return;
        
        setActiveButton(button);
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
                            <IconButton className={sharedClasses.iconButton} onClick={() => handleOnClick(setupButtonAction(btn.action), btn.id)} />
                        </div>
                    )}
                </div>
            }
        </div>
    ), [panelInfo, activeButton])
}

export default PopoutPanelContainer;