using MSFSTouchPanel.ArduinoAgent;
using MSFSTouchPanel.FSConnector;
using MSFSTouchPanel.Shared;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class ActionProvider
    {
        private string _currentSelectedAction;
        private SimConnector _simConnector;
        private bool _isSimConnected;

        private List<EncoderCommandMapping> _encoderCommands;
        
        public ActionProvider(SimConnector simConnector, ArduinoProvider arduinoProvider)
        {
            _currentSelectedAction = null;
            _isSimConnected = false;
            _simConnector = simConnector;

            LoadEncoderCommandMapping();
        }

        public void Start()
        {
            _isSimConnected = true;
        }

        public void Stop()
        {
            _isSimConnected = false;
        }

        public void ExecAction(string action, string value, PlaneProfile planeProfile)
        {
            if (_isSimConnected && action != null)
            {
                try
                {
                    _currentSelectedAction = action;

                    if (action == "NO_ACTION") return;

                    uint uintValue;

                    switch (action.ToUpper())
                    {
                        case "HEADING_BUG_SYNC":
                            action = "HEADING_BUG_SET";
                            uintValue = Convert.ToUInt32(value);
                            break;
                        case "AP_ALT_SYNC":
                            action = "AP_ALT_VAR_SET_ENGLISH";
                            uintValue = Convert.ToUInt32(value);
                            break;
                        case "COM_STBY_RADIO_SET":
                        case "COM2_STBY_RADIO_SET":
                            uintValue = Convert.ToUInt32("0x" + Convert.ToInt32(Convert.ToDouble(value) * 1000).ToString().Substring(1, 4), 16);
                            break;
                        case "NAV1_STBY_SET":
                        case "NAV2_STBY_SET":
                            uintValue = Convert.ToUInt32("0x" + Convert.ToInt32(Convert.ToDouble(value) * 100).ToString(), 16);
                            break;
                        case "XPNDR_SET":
                            uintValue = Convert.ToUInt32(value, 16);
                            break;
                        case "KOHLSMAN_SET":
                            uintValue = Convert.ToUInt32(Convert.ToDouble(value) * 33.8639 * 16);      // convert Hg to millibars * 16
                            break;
                        case "ADF_COMPLETE_SET":
                            uintValue = Convert.ToUInt32("0x" + Convert.ToString(value + "0000"), 16);
                            break;
                        default:
                            if (Convert.ToInt32(value) < 0)
                                uintValue = UInt32.MaxValue - Convert.ToUInt32(Math.Abs(Convert.ToInt32(value)));
                            else
                                uintValue = Convert.ToUInt32(value);
                            break;
                    }

                    _simConnector.SetEventID(action, uintValue);
                }
                catch (Exception e)
                {
                    Logger.ServerLog(e.Message, LogLevel.ERROR);
                }
            }
        }

        public void ArduinoInputHandler(object sender, EventArgs<ArduinoInputData> e)
        {
            if (e.Value.InputName == InputName.Keypad)
            {
                var key = e.Value.InputAction.ToString().Substring(3);
                _simConnector.SetEventID("ATC_MENU_" + key, 1);
            }
            else if (_currentSelectedAction != null)
            {
                try
                {
                    var command = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, e.Value.InputName, e.Value.InputAction);
                    _simConnector.SetEventID(command, 1);
                   
                }
                catch (Exception exception)
                {
                    Logger.ServerLog(exception.Message, LogLevel.ERROR);
                }
            }
        }

        private void LoadEncoderCommandMapping()
        {
            var filePath = Path.Combine(AppContext.BaseDirectory, @"Data\EncoderCommandMapping.json");
            _encoderCommands = JsonConvert.DeserializeObject<List<EncoderCommandMapping>>(File.ReadAllText(filePath));
        }
    }
}