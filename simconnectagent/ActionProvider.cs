using MSFSTouchPanel.ArduinoAgent;
using MSFSTouchPanel.FSConnector;
using MSFSTouchPanel.Shared;
using StringMath;
using System;
using System.Text.RegularExpressions;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class ActionProvider
    {
        private SimConnector _simConnector;
        private bool _isSimConnected;

        private SimConnectEncoderAction _currentSimConnectEncoderAction;

        public ActionProvider(SimConnector simConnector, ArduinoProvider arduinoProvider)
        {
            _currentSimConnectEncoderAction = null;
            _isSimConnected = false;
            _simConnector = simConnector;
        }

        public void Start()
        {
            _isSimConnected = true;
        }

        public void Stop()
        {
            _isSimConnected = false;
        }

        public void ExecAction(SimConnectActionData actionData)
        {
            CommandAction commandAction;
            
            if (_isSimConnected && actionData.Action != null)
            {
                try
                {
                    if (actionData.Action == "NO_ACTION") return;

                    // clear encoder actions on each new SimConnect action submitted other than actual encoder movement
                    if (actionData.ActionType != SimConnectActionType.EncoderAction)
                        _currentSimConnectEncoderAction = actionData.EncoderAction;

                    switch (actionData.Action)
                    {
                        case "LOWER_ENCODER_INC":
                            if (_currentSimConnectEncoderAction == null) 
                                return;
                            commandAction = new CommandAction(_currentSimConnectEncoderAction.Encoder1CW, _currentSimConnectEncoderAction.ActionType);
                            break;
                        case "LOWER_ENCODER_DEC":
                            if (_currentSimConnectEncoderAction == null) 
                                return;
                            commandAction = new CommandAction(_currentSimConnectEncoderAction.Encoder1CCW, _currentSimConnectEncoderAction.ActionType);
                            break;
                        case "UPPER_ENCODER_INC":
                            if (_currentSimConnectEncoderAction == null) 
                                return;
                            commandAction = new CommandAction(_currentSimConnectEncoderAction.Encoder2CW, _currentSimConnectEncoderAction.ActionType);
                            break;
                        case "UPPER_ENCODER_DEC":
                            if (_currentSimConnectEncoderAction == null) 
                                return;
                            commandAction = new CommandAction(_currentSimConnectEncoderAction.Encoder2CCW, _currentSimConnectEncoderAction.ActionType);
                            break;
                        case "ENCODER_PUSH":
                            if (_currentSimConnectEncoderAction == null) 
                                return;
                            commandAction = new CommandAction(_currentSimConnectEncoderAction.Encoder1Switch, _currentSimConnectEncoderAction.ActionType);
                            break;
                        default:
                            commandAction = new CommandAction(actionData.Action, actionData.ActionType, Convert.ToUInt16(actionData.ActionValue));
                            break;
                    }

                    ExecuteCommand(commandAction);
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
            else if (_currentSimConnectEncoderAction != null)
            {
                var commandAction = ActionLogicArduino.GetSimConnectCommand(_currentSimConnectEncoderAction, e.Value.InputName, e.Value.InputAction);
                ExecuteCommand(commandAction);
            }
        }

        private void ExecuteCommand(CommandAction commandAction)
        {
            string simConnectCommand = commandAction.Action;
            SimConnectActionType simConnectCommandType = commandAction.ActionType;
            uint simConnectCommandValue = commandAction.ActionValue;

            if (String.IsNullOrEmpty(simConnectCommand))
                return;

            switch (simConnectCommandType)
            {
                case SimConnectActionType.SimEventId:
                    _simConnector.SetEventID(simConnectCommand, simConnectCommandValue);
                    break;
                case SimConnectActionType.SimVarCode:
                    // Match content between curly braces for variable and to be replaced by simConnect data
                    const string pattern = @"(?<=\{)[^}]*(?=\})";
                    foreach (var match in Regex.Matches(simConnectCommand, pattern))
                    {
                        var variableName = match.ToString();
                        var variable = _simConnector.SimConnectDataDefinitions.Find(x => x.PropName == variableName);
                        var variableValue = variable != null ? variable.Value : 0;

                        simConnectCommand = simConnectCommand.Replace("{" + match.ToString() + "}", variableValue.ToString());

                        // Find any math string that needs evaluation
                        const string mathStringPattern = @"(?<=\[).+?(?=\])";
                        foreach (var mathStringMatch in Regex.Matches(simConnectCommand, mathStringPattern))
                        {
                            var myCalculator = new Calculator();
                            var result = myCalculator.Evaluate(mathStringMatch.ToString()).ToString();

                            simConnectCommand = simConnectCommand.Replace("[" + mathStringMatch.ToString() + "]", result);
                        }
                    }

                    _simConnector.SetSimVar(simConnectCommand);
                    break;
            }
        }
    }
}