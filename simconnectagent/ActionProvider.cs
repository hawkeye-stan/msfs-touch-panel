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

        public void SetLVar(string propName, string value)
        {
            if (_isSimConnected && propName != null)
            {
                try
                {
                    var definition = _simConnector.SimConnectDataDefinitions.Find(x => x.PropName == propName);
                    _simConnector.SetSimVar($"{value} (>L:{definition.VariableName})");
                }
                catch (Exception e)
                {
                    Logger.ServerLog(e.Message, LogLevel.ERROR);
                }
            }
        }

        public void ExecAction(string action, string actionType, string value)
        {
            if (_isSimConnected && action != null)
            {
                try
                {
                    uint uintValue;

                    if (action == "NO_ACTION") return;

                    if (action == "UPPER_ENCODER_INC" || action == "UPPER_ENCODER_DEC" || action == "LOWER_ENCODER_INC" || action == "LOWER_ENCODER_DEC" || action == "ENCODER_PUSH")
                    {
                        switch(action)
                        {
                            case "UPPER_ENCODER_INC":
                                action = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, InputName.Encoder2, InputAction.CW);
                                break;
                            case "UPPER_ENCODER_DEC":
                                action = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, InputName.Encoder2, InputAction.CCW);
                                break;
                            case "LOWER_ENCODER_INC":
                                action = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, InputName.Encoder1, InputAction.CW);
                                break;
                            case "LOWER_ENCODER_DEC":
                                action = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, InputName.Encoder1, InputAction.CCW);
                                break;
                            case "ENCODER_PUSH":
                                action = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, InputName.Encoder1, InputAction.SW);
                                break;
                        }

                        // Kodiak
                        int currentValue;
                        switch (_currentSelectedAction)
                        {
                            case "KODIAK_INSTRUMENTS_LIGHT_KNOB_SELECT":
                                switch(action)
                                {
                                    case "INCREASE_GLARESHIELD":
                                        currentValue = Convert.ToInt32(Convert.ToDouble(_simConnector.SimConnectDataDefinitions.Find(x => x.PropName == "KODIAK_GLARESHIELD_SETTING").Value) * 100);
                                        if (currentValue != 100)
                                        {
                                            _simConnector.SetSimVar($"{currentValue + 5} (>K:LIGHT_POTENTIOMETER_3_SET) 1 (>K:GLARESHIELD_LIGHTS_ON)");
                                            return;
                                        }
                                        break;
                                    case "DECREASE_GLARESHIELD":
                                        currentValue = Convert.ToInt32(Convert.ToDouble(_simConnector.SimConnectDataDefinitions.Find(x => x.PropName == "KODIAK_GLARESHIELD_SETTING").Value) * 100);
                                        if (currentValue != 0)
                                        {
                                            _simConnector.SetSimVar($"{currentValue - 5} (>K:LIGHT_POTENTIOMETER_3_SET)");
                                            return;
                                        }
                                        break;
                                    case "INCREASE_INSTRUMENT":
                                        currentValue = Convert.ToInt32(Convert.ToDouble(_simConnector.SimConnectDataDefinitions.Find(x => x.PropName == "KODIAK_INSTRUMENTATION_LIGHT_SETTING").Value) * 100);
                                        if (currentValue != 100)
                                        {
                                            _simConnector.SetSimVar($"{currentValue + 5} (>K:LIGHT_POTENTIOMETER_2_SET) 1 (>K:PANEL_LIGHTS_ON)");
                                            return;
                                        }
                                        break;
                                    case "DECREASE_INSTRUMENT":
                                        currentValue = Convert.ToInt32(Convert.ToDouble(_simConnector.SimConnectDataDefinitions.Find(x => x.PropName == "KODIAK_INSTRUMENTATION_LIGHT_SETTING").Value) * 100);
                                        if (currentValue != 0)
                                        {
                                            _simConnector.SetSimVar($"{currentValue - 5} (>K:LIGHT_POTENTIOMETER_2_SET)");
                                            return;
                                        }
                                        break;
                                }
                                return;
                            case "KODIAK_PANEL_LIGHT_KNOB_SELECT":
                                currentValue = Convert.ToInt32(Convert.ToDouble(_simConnector.SimConnectDataDefinitions.Find(x => x.PropName == "KODIAK_PANEL_LIGHT_SETTING").Value) * 100);
                                if (action == "INCREASE")
                                {
                                    if (currentValue != 100)
                                    {
                                        _simConnector.SetSimVar($"{currentValue + 5} (>K:LIGHT_POTENTIOMETER_21_SET) 1 (>K:PEDESTRAL_LIGHTS_ON)");
                                        return;
                                    }
                                }
                                else
                                {
                                    if (currentValue != 0)
                                    {
                                        _simConnector.SetSimVar($"{currentValue - 5} (>K:LIGHT_POTENTIOMETER_21_SET)");
                                        return;
                                    }
                                }
                                break;
                        }

                        uintValue = 1;
                    }
                    else
                    {
                        _currentSelectedAction = action;

                        uintValue = Convert.ToUInt32(value);

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
                    }

                    if (actionType == "KEvent")
                        _simConnector.SetSimVar($"{uintValue} (>K:{action.ToUpper()})");
                    else
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
                var command = ActionLogicArduino.GetSimConnectCommand(_encoderCommands, _currentSelectedAction, e.Value.InputName, e.Value.InputAction);
                _simConnector.SetEventID(command, 1);
            }
        }

        private void LoadEncoderCommandMapping()
        {
            var filePath = Path.Combine(AppContext.BaseDirectory, @"Data\EncoderCommandMapping.json");
            _encoderCommands = JsonConvert.DeserializeObject<List<EncoderCommandMapping>>(File.ReadAllText(filePath));
        }
    }
}