import React, { useMemo, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../../Services/DataProviders/SimConnectDataProvider';
import { useLocalStorageData } from '../../Services/LocalStorageProvider';
import { simConnectPost, simConnectSetLVar } from '../../Services/ActionProviders/simConnectPost';

const useStyles = makeStyles((theme) => ({
    iconButton: {
        width: '100%',
        height: '100%'
    },
    iconImageHighlight: {
        filter: 'brightness(200%)',
    }
}));

const ButtonTemplate = ({ btn, panelInfo, showEncoder }) => {
    const { simConnectData } = useSimConnectData();
    const { isUsedArduino } = useLocalStorageData().configurationData;
    const sharedClasses = useStyles(panelInfo[0]);
    const panelClasses = panelInfo[0].styles(panelInfo[0]);
    const dataBindingValue = simConnectData[btn.binding];
    const activeButton = useRef(false);

    const setupButtonClasses = (btn) => {
        var styleClasses = [];

        for(let i = 0; i < btn.classes.length; i++)
            styleClasses.push(panelClasses[btn.classes[i]]);

        styleClasses.push(activeButton.current? sharedClasses.iconImageHighlight : '');

        return styleClasses.join(' ');
    }

    const setupButtonStyles = (btn) => {
        if (btn.images !== undefined) {
            let dataValue = simConnectData[btn.binding];
            let imageUrl = btn.images.find(x => x.val == dataValue).url

            let style = { backgroundImage: `url(/img/${panelInfo[0].planeId}/${imageUrl})`, left: (btn.left / panelInfo[0].width * 100.0) + '%', top: (btn.top / panelInfo[0].height * 100.0) + '%' };
            return style;
        }

        let style = { backgroundImage: `url(/img/${panelInfo[0].planeId}/${btn.image})`, left: (btn.left / panelInfo[0].width * 100.0) + '%', top: (btn.top / panelInfo[0].height * 100.0) + '%' };
        return style;
    }

    const handleOnClick = (event, button) => {
        if (button.valueSequence !== undefined && button.valueSequence.length > 0)
        {
            var sequence = button.valueSequence.find(x => x.lastValue === dataBindingValue);
            simConnectSetLVar(button.binding, sequence.newValue);
        }

        if (button.action !== undefined && button.action !== null)
            simConnectPost(button.action, button.actionValue !== undefined? button.actionValue : 1, button.actionType);

        if(!isUsedArduino && (button.useEncoder || button.useDualEncoder))
            showEncoder(event, button.useDualEncoder);

        if(button.highlight === undefined || button.highlight)    
        {
            activeButton.current = true;
            setTimeout(() => {activeButton.current = false; }, 500);
        }
    }

    return useMemo(() => (
        <div className={setupButtonClasses(btn)} style={setupButtonStyles(btn)}>
            <IconButton className={sharedClasses.iconButton} onClick={(event) => handleOnClick(event, btn)} />
        </div>
    ), [btn, dataBindingValue, activeButton.current])
}

export default ButtonTemplate;