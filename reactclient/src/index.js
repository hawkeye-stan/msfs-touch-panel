import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { darkTheme } from './themes';
import './index.css';
import TouchPanel from './App/TouchPanel/TouchPanel';
import WebPanelSelection from './App/WebPanel/WebPanelSelection';
import WebPanel from './App/WebPanel/WebPanel';
import WebMapPanel from './App/WebPanel/WebMapPanel';


ReactDOM.render(
    <React.Fragment>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={darkTheme} >
                <BrowserRouter>
                    <Route exact path='/' render={() => <TouchPanel/>}/>
                    <Route exact path='/webpanel' render={() => <WebPanelSelection/>}/>
                    <Route exact path='/:displayFormat/:planeType/:panelType' render={(props) => <WebPanel planeType={props.match.params.planeType} panelType={props.match.params.panelType} displayFormat={props.match.params.displayFormat} /> } /> 
                    <Route exact path='/mappanel' render={() => <WebMapPanel></WebMapPanel>}/>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.Fragment>,
    document.getElementById('root')
);