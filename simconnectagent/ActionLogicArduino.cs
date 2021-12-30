using MSFSTouchPanel.ArduinoAgent;
using System;
using System.Collections.Generic;

namespace MSFSTouchPanel.SimConnectAgent
{
    public class ActionLogicArduino
    {
        private const string NO_ACTION = "NO_ACTION";

        public static string GetSimConnectCommand(List<EncoderCommandMapping> commandMappings, string action, InputName encoderName, InputAction encoderAction)
        {
            var mapping = commandMappings.Find(m => m.Command.Contains(action));

            if (mapping == null)
                throw new Exception($"EncoderCommandMapping for {action} cannot be found.");

            switch (encoderName)
            {
                case InputName.Encoder1:
                    switch (encoderAction)
                    {
                        case InputAction.CW:
                            return mapping.Encoder1CW;
                        case InputAction.CCW:
                            return mapping.Encoder1CCW;
                        case InputAction.SW:
                            return mapping.Encoder1Switch;
                    }
                    break;
                case InputName.Encoder2:
                    switch (encoderAction)
                    {
                        case InputAction.CW:
                            return mapping.Encoder2CW;
                        case InputAction.CCW:
                            return mapping.Encoder2CCW;
                        case InputAction.SW:
                            return mapping.Encoder2Switch;
                    }
                    break;
                case InputName.Joystick:
                    switch (encoderAction)
                    {
                        case InputAction.UP:
                            return mapping.Joystick1Up;
                        case InputAction.DOWN:
                            return mapping.Joystick1Down;
                        case InputAction.LEFT:
                            return mapping.Joystick1Left;
                        case InputAction.RIGHT:
                            return mapping.Joystick1Right;
                        case InputAction.SW:
                            return mapping.Joystick1Switch;
                    }
                    break;
            }

            return NO_ACTION;
        }
    }
}
