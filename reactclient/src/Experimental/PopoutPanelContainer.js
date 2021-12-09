import React, { useState, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = props => makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    buttonOverlay:
    {
        position: 'relative',
        backgroundColor: theme.palette.background,
        backgroundImage: `url(/img/${props.planetype}/${props.panel}/background.png)`,
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

const PopoutPanelContainer = ({panelInfo, frameonly}) => {
    const sharedClasses = useStyles(panelInfo)();
    const panelClasses = panelInfo.styles(panelInfo)();
    const [activeButton, setActiveButton] = useState();
        
    const setupButtonClasses = (btn) => {
        var styleClasses = [];

        for(let i = 0; i < btn.classes.length; i++)
            styleClasses.push(panelClasses[btn.classes[i]]);

        styleClasses.push(activeButton === btn.id ? sharedClasses.iconImageHighlight : '');

        return styleClasses.join(' ');
    }

    const setupButtonStyles = (btn) => {
        let style = {backgroundImage: `url(/img/${panelInfo.planetype}/${btn.image})`, left: (btn.left / panelInfo.width * 100.0) + '%', top: (btn.top / panelInfo.height * 100.0) + '%'};
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

    return (
        <div className={sharedClasses.root}>
            { !frameonly && 
                <div className={panelClasses.iframePanel}>
                    <iframe title='iframePanel' className={sharedClasses.iframe} src={`/assets/webpanel.html?planetype=${panelInfo.planetype}&panel=${panelInfo.panel}`} frameBorder="0"></iframe>
                </div> 
            }
            <div className={sharedClasses.buttonOverlay}>
                { panelInfo.definitions.map(btn =>
                    <div key={btn.id} className={setupButtonClasses(btn)} style={setupButtonStyles(btn)}>
                        <IconButton className={sharedClasses.iconButton} onClick={() => handleOnClick(setupButtonAction(btn.action), btn.id)} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PopoutPanelContainer;