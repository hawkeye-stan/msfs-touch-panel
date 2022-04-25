using MSFSTouchPanel.ArduinoAgent;
using MSFSTouchPanel.Shared;
using System;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class ActionLogicArduino
    {
        private const string NO_ACTION = "NO_ACTION";

        public static CommandAction GetSimConnectCommand(SimConnectEncoderAction encoderAction, InputName inputName, InputAction inputAction)
        {
            switch (inputName)
            {
                case InputName.Encoder1:
                    switch (inputAction)
                    {
                        case InputAction.CW:
                            return new CommandAction(encoderAction.Encoder1CW, encoderAction.ActionType);
                        case InputAction.CCW:
                            return new CommandAction(encoderAction.Encoder1CCW, encoderAction.ActionType);
                        case InputAction.SW:
                            return new CommandAction(encoderAction.Encoder1Switch, encoderAction.ActionType);
                    }
                    break;
                case InputName.Encoder2:
                    switch (inputAction)
                    {
                        case InputAction.CW:
                            return new CommandAction(encoderAction.Encoder2CW, encoderAction.ActionType);
                        case InputAction.CCW:
                            return new CommandAction(encoderAction.Encoder2CCW, encoderAction.ActionType);
                        case InputAction.SW:
                            return new CommandAction(encoderAction.Encoder2Switch, encoderAction.ActionType);
                    }
                    break;
                case InputName.Joystick:
                    switch (inputAction)
                    {
                        case InputAction.UP:
                            return new CommandAction(encoderAction.Joystick1Up, encoderAction.ActionType);
                        case InputAction.DOWN:
                            return new CommandAction(encoderAction.Joystick1Down, encoderAction.ActionType);
                        case InputAction.LEFT:
                            return new CommandAction(encoderAction.Joystick1Left, encoderAction.ActionType);
                        case InputAction.RIGHT:
                            return new CommandAction(encoderAction.Joystick1Right, encoderAction.ActionType);
                        case InputAction.SW:
                            return new CommandAction(encoderAction.Joystick1Switch, encoderAction.ActionType);
                    }
                    break;
            }

            return new CommandAction(NO_ACTION, SimConnectActionType.EncoderAction);
        }
    }
}
