import React, { useMemo, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { useSimConnectData } from '../Services/SimConnectDataProvider';
import { useLocalStorageData } from '../Services/LocalStorageProvider';
import { simConnectPost } from '../Services/simConnectPost';

const useStyles = makeStyles(() => ({
    iconButton: {
        width: '100%',
        height: '100%'
    },
    iconImageHighlight: {
        filter: 'brightness(200%)',
    },
    controlBase: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
    }
}));

const InteractiveControlTemplate = ({ btn, panelInfo, showEncoder }) => {
    const { simConnectData } = useSimConnectData();
    const { isUsedArduino } = useLocalStorageData().configurationData;
    const classes = useStyles(panelInfo);
    const dataBindingValue = simConnectData[btn.binding];
    const activeButton = useRef(false);

    const setupButtonClasses = (btn) => {
        var styleClasses = [];

        styleClasses.push(classes.controlBase);

        if(btn.highlight === undefined || btn.highlight)    
            styleClasses.push(activeButton.current? classes.iconImageHighlight : '');

        return styleClasses.join(' ');
    }

    const setupButtonBackgroundStyle = (btn) => {
        if (btn.images !== undefined) {
            let dataValue = simConnectData[btn.binding];
            
            if(dataValue === undefined)
                return { backgroundImage: `url(/profiles/${panelInfo.planeId}/img/${btn.images[0].url})`};   


            let image = btn.images.find(x => x.val == dataValue);
            if(image === undefined)
            {
                console.log('Error binding data value to interactive control button... Button Id: ' + btn.id + '  Data Value:' + dataValue);
                return { backgroundImage: `url(/profiles/${panelInfo.planeId}/img/${btn.images[0].url})`};        
            }
            
            return { backgroundImage: `url(/profiles/${panelInfo.planeId}/img/${image.url})`};
        }

        return { backgroundImage: `url(/profiles/${panelInfo.planeId}/img/${btn.image})`};
    }
    
    const setupButtonLocationStyle = (btn) => {
        return { left: (btn.left / panelInfo.width * 100.0) + '%', top: (btn.top / panelInfo.height * 100.0) + '%' };
    }

    const setupWidthHeightStyle = (btn) => {
        if(btn.controlSize === undefined) 
            return;

        return { width: `calc(100% * ${btn.controlSize.width} / ${panelInfo.width})`, height: `calc(100% * ${btn.controlSize.height} / ${panelInfo.height})`};
    }

    const handleOnClick = (event, btn) => {
        if (btn.action !== undefined && btn.action !== null)
            simConnectPost({action: btn.action, actionValue: btn.actionValue, actionType: btn.actionType, encoderAction: btn.encoderActions === undefined ? null : btn.encoderActions });

        if(!isUsedArduino && (btn.useEncoder || btn.useDualEncoder))
            showEncoder(event, btn.useDualEncoder);

        if(btn.highlight === undefined || btn.highlight)    
        {
            activeButton.current = true;
            setTimeout(() => {activeButton.current = false; }, 500);
        }
    }

    return useMemo(() => (
        <div className={setupButtonClasses(btn)} style={{...setupButtonLocationStyle(btn), ...setupButtonBackgroundStyle(btn), ...setupWidthHeightStyle(btn)}}>
            <IconButton className={classes.iconButton} onClick={(event) => handleOnClick(event, btn)} />
        </div>
    ), [btn, dataBindingValue, activeButton.current])
}

export default InteractiveControlTemplate;