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

        if(btn.highlight === undefined || btn.highlight)    
            styleClasses.push(activeButton.current? sharedClasses.iconImageHighlight : '');

        return styleClasses.join(' ');
    }

    const setupButtonBackgroundStyle = (btn) => {
        if (btn.images !== undefined) {
            let dataValue = simConnectData[btn.binding];
            let imageUrl = btn.images.find(x => x.val == dataValue).url;

            return { backgroundImage: `url(/img/${panelInfo[0].planeId}/${imageUrl})`};
        }

        return { backgroundImage: `url(/img/${panelInfo[0].planeId}/${btn.image})`};
    }
    
    const setupButtonLocationStyle = (btn) => {
        return { left: (btn.left / panelInfo[0].width * 100.0) + '%', top: (btn.top / panelInfo[0].height * 100.0) + '%' };
    }

    const handleOnClick = (event, btn) => {
        if (btn.valueSequence !== undefined && btn.valueSequence.length > 0)
        {
            var sequence = btn.valueSequence.find(x => x.lastValue === dataBindingValue);
            simConnectSetLVar(btn.binding, sequence.newValue);
        }

        if (btn.action !== undefined && btn.action !== null)
            simConnectPost(btn.action, btn.actionValue !== undefined? btn.actionValue : 1, btn.actionType);

        if(!isUsedArduino && (btn.useEncoder || btn.useDualEncoder))
            showEncoder(event, btn.useDualEncoder);

        if(btn.highlight === undefined || btn.highlight)    
        {
            activeButton.current = true;
            setTimeout(() => {activeButton.current = false; }, 500);
        }
    }

    return useMemo(() => (
        <div className={setupButtonClasses(btn)} style={{...setupButtonLocationStyle(btn), ...setupButtonBackgroundStyle(btn)}}>
            <IconButton className={sharedClasses.iconButton} onClick={(event) => handleOnClick(event, btn)} />
        </div>
    ), [btn, dataBindingValue, activeButton.current])
}

export default ButtonTemplate;